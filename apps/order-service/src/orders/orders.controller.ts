import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { GRPC_SERVICES } from '@fashion-store/proto';
import { status } from '@grpc/grpc-js';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @GrpcMethod(GRPC_SERVICES.ORDER_SERVICE, 'Create')
  async create(data: any) {
    // Map proto fields to DTO
    const dto = {
      userId: data.user_id,
      items: data.items?.map((item: any) => ({
        productId: item.product_id,
        variantId: item.variant_id,
        productName: item.product_name,
        sku: item.sku,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unit_price,
      })) || [],
      shippingAddress: {
        street: data.shipping_address?.street,
        city: data.shipping_address?.city,
        state: data.shipping_address?.state,
        postalCode: data.shipping_address?.postal_code,
        country: data.shipping_address?.country,
        firstName: data.shipping_address?.first_name,
        lastName: data.shipping_address?.last_name,
        phone: data.shipping_address?.phone,
      },
      shippingCost: data.shipping_cost,
      discount: data.discount,
      notes: data.notes,
    };

    const order = await this.ordersService.create(dto);
    return this.mapOrderToProto(order);
  }

  @GrpcMethod(GRPC_SERVICES.ORDER_SERVICE, 'FindOne')
  async findOne(data: { id: string }) {
    const order = await this.ordersService.findOne(data.id);
    return this.mapOrderToProto(order);
  }

  @GrpcMethod(GRPC_SERVICES.ORDER_SERVICE, 'FindByUser')
  async findByUser(data: { user_id: string; page?: number; limit?: number }) {
    const result = await this.ordersService.findByUser(
      data.user_id,
      data.page || 1,
      data.limit || 10,
    );

    return {
      orders: result.orders.map((o) => this.mapOrderToProto(o)),
      meta: {
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        total_pages: result.meta.totalPages,
      },
    };
  }

  @GrpcMethod(GRPC_SERVICES.ORDER_SERVICE, 'UpdateStatus')
  async updateStatus(data: any) {
    const dto = {
      id: data.id,
      status: data.status,
      reason: data.reason,
      changedBy: data.changed_by,
      trackingNumber: data.tracking_number,
      carrier: data.carrier,
    };

    const order = await this.ordersService.updateStatus(dto);
    return this.mapOrderToProto(order);
  }

  @GrpcMethod(GRPC_SERVICES.ORDER_SERVICE, 'Cancel')
  async cancel(data: { id: string; user_id: string; reason?: string }) {
    const order = await this.ordersService.cancel({
      id: data.id,
      userId: data.user_id,
      reason: data.reason,
    });
    return this.mapOrderToProto(order);
  }

  private mapOrderToProto(order: any) {
    return {
      id: order.id,
      user_id: order.userId,
      status: order.status,
      subtotal: Number(order.subtotal),
      shipping_cost: Number(order.shippingCost),
      tax: Number(order.tax),
      discount: Number(order.discount),
      total: Number(order.total),
      payment_id: order.paymentId,
      payment_status: order.paymentStatus,
      shipping_address: order.shippingAddress,
      tracking_number: order.trackingNumber,
      carrier: order.carrier,
      notes: order.notes,
      items: order.items?.map((item: any) => ({
        id: item.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.productName,
        sku: item.sku,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: Number(item.unitPrice),
        total_price: Number(item.totalPrice),
      })) || [],
      created_at: order.createdAt?.toISOString(),
      updated_at: order.updatedAt?.toISOString(),
      confirmed_at: order.confirmedAt?.toISOString(),
      shipped_at: order.shippedAt?.toISOString(),
      delivered_at: order.deliveredAt?.toISOString(),
      cancelled_at: order.cancelledAt?.toISOString(),
    };
  }
}
