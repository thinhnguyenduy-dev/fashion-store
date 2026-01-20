import { Injectable, Logger } from '@nestjs/common';
import { OrderPrismaService } from '../prisma/order-prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, CancelOrderDto, OrderStatusEnum } from './dto';
import { RabbitMQService, EXCHANGES, ROUTING_KEYS } from '@fashion-store/rabbitmq';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: OrderPrismaService,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  async create(dto: CreateOrderDto) {
    // Calculate totals
    const subtotal = dto.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const shippingCost = dto.shippingCost || 0;
    const discount = dto.discount || 0;
    const tax = subtotal * 0.1; // 10% tax (simplified)
    const total = subtotal + shippingCost + tax - discount;

    try {
      const order = await this.prisma.order.create({
        data: {
          userId: dto.userId,
          subtotal: new Decimal(subtotal),
          shippingCost: new Decimal(shippingCost),
          tax: new Decimal(tax),
          discount: new Decimal(discount),
          total: new Decimal(total),
          shippingAddress: dto.shippingAddress as any,
          notes: dto.notes,
          items: {
            create: dto.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              sku: item.sku,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              unitPrice: new Decimal(item.unitPrice),
              totalPrice: new Decimal(item.unitPrice * item.quantity),
            })),
          },
          statusHistory: {
            create: {
              toStatus: 'PENDING',
              changedBy: 'system',
            },
          },
        },
        include: {
          items: true,
          statusHistory: true,
        },
      });

      this.logger.log(`Created order: ${order.id}`);

      // Publish ORDER_CREATED event to trigger saga
      await this.rabbitmqService.publish(
        EXCHANGES.DOMAIN_EVENTS,
        ROUTING_KEYS.ORDER_CREATED,
        {
          eventId: crypto.randomUUID(),
          eventType: 'ORDER_CREATED',
          timestamp: new Date().toISOString(),
          correlationId: order.id,
          version: 1,
          payload: {
            orderId: order.id,
            userId: order.userId,
            items: order.items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              quantity: i.quantity,
              sku: i.sku,
            })),
            shippingAddress: order.shippingAddress,
            totals: {
              subtotal: Number(order.subtotal),
              shipping: Number(order.shippingCost),
              tax: Number(order.tax),
              discount: Number(order.discount),
              total: Number(order.total),
            },
          },
        },
      );

      return order;
    } catch (error) {
      this.logger.error('Failed to create order', error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to create order',
      });
    }
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Order not found',
      });
    }

    return order;
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(dto: UpdateOrderStatusDto) {
    const order = await this.findOne(dto.id);
    const previousStatus = order.status;

    const updateData: any = {
      status: dto.status,
    };

    // Set timestamps based on new status
    if (dto.status === OrderStatusEnum.CONFIRMED) {
      updateData.confirmedAt = new Date();
    } else if (dto.status === OrderStatusEnum.SHIPPED) {
      updateData.shippedAt = new Date();
      updateData.trackingNumber = dto.trackingNumber;
      updateData.carrier = dto.carrier;
    } else if (dto.status === OrderStatusEnum.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (dto.status === OrderStatusEnum.CANCELLED) {
      updateData.cancelledAt = new Date();
    }

    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: dto.id },
        data: {
          ...updateData,
          statusHistory: {
            create: {
              fromStatus: previousStatus,
              toStatus: dto.status,
              reason: dto.reason,
              changedBy: dto.changedBy || 'system',
            },
          },
        },
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: 'desc' } },
        },
      });

      this.logger.log(`Updated order ${dto.id} status to ${dto.status}`);

      // Publish appropriate event
      const routingKey = this.getRoutingKeyForStatus(dto.status);
      if (routingKey) {
        await this.rabbitmqService.publish(
          EXCHANGES.DOMAIN_EVENTS,
          routingKey,
          {
            eventId: crypto.randomUUID(),
            eventType: `ORDER_${dto.status}`,
            timestamp: new Date().toISOString(),
            correlationId: dto.id,
            version: 1,
            payload: {
              orderId: dto.id,
              userId: updatedOrder.userId,
              previousStatus,
              newStatus: dto.status,
              reason: dto.reason,
            },
          },
        );
      }

      return updatedOrder;
    } catch (error) {
      this.logger.error(`Failed to update order status ${dto.id}`, error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to update order status',
      });
    }
  }

  async cancel(dto: CancelOrderDto) {
    const order = await this.findOne(dto.id);

    if (order.userId !== dto.userId) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Not authorized to cancel this order',
      });
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new RpcException({
        code: status.FAILED_PRECONDITION,
        message: `Cannot cancel order in ${order.status} status`,
      });
    }

    return this.updateStatus({
      id: dto.id,
      status: OrderStatusEnum.CANCELLED,
      reason: dto.reason || 'Cancelled by user',
      changedBy: dto.userId,
    });
  }

  private getRoutingKeyForStatus(status: OrderStatusEnum): string | null {
    const map: Record<string, string> = {
      CONFIRMED: ROUTING_KEYS.ORDER_CONFIRMED,
      CANCELLED: ROUTING_KEYS.ORDER_CANCELLED,
      SHIPPED: ROUTING_KEYS.ORDER_SHIPPED,
      DELIVERED: ROUTING_KEYS.ORDER_DELIVERED,
    };
    return map[status] || null;
  }
}
