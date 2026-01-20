import { Injectable, Logger } from '@nestjs/common';
import { InventoryPrismaService } from '../prisma/inventory-prisma.service';
import { ReserveStockDto, ReleaseStockDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RabbitMQService, EXCHANGES, ROUTING_KEYS } from '@fashion-store/rabbitmq';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    private readonly prisma: InventoryPrismaService,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  async getStock(productId: string, variantId?: string) {
    const whereCondition: any = { productId };
    if (variantId) {
      whereCondition.variantId = variantId;
    }

    const items = await this.prisma.inventoryItem.findMany({
      where: whereCondition,
    });

    return items;
  }

  async reserveStock(dto: ReserveStockDto) {
    const { orderId, items } = dto;
    
    // Start transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Check availability for all items
      for (const item of items) {
        const inventoryItem = await tx.inventoryItem.findUnique({
          where: { variantId: item.variantId },
        });

        if (!inventoryItem) {
          throw new RpcException({
            code: status.NOT_FOUND,
            message: `Product variant ${item.variantId} not found`,
          });
        }

        const available = inventoryItem.quantity - inventoryItem.reserved;
        if (available < item.quantity) {
          throw new RpcException({
            code: status.FAILED_PRECONDITION,
            message: `Insufficient stock for SKU ${item.sku}. Available: ${available}, Requested: ${item.quantity}`,
          });
        }
      }

      // 2. Reserve
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 min reservation

      const reservations = [];

      for (const item of items) {
        // Update inventory reserved count
        await tx.inventoryItem.update({
          where: { variantId: item.variantId },
          data: {
            reserved: { increment: item.quantity },
          },
        });

        // Create reservation record
        const reservation = await tx.stockReservation.create({
          data: {
            orderId,
            variantId: item.variantId,
            sku: item.sku,
            quantity: item.quantity,
            status: 'PENDING',
            expiresAt,
          },
        });
        reservations.push(reservation);
      }
      
      this.logger.log(`Reserved stock for order ${orderId}`);
      
      // Publish event
      await this.rabbitmqService.publish(
        EXCHANGES.DOMAIN_EVENTS,
        ROUTING_KEYS.STOCK_RESERVED,
        {
           eventId: crypto.randomUUID(),
           eventType: 'STOCK_RESERVED',
           timestamp: new Date().toISOString(),
           correlationId: orderId,
           payload: { orderId, items }
        }
      );

      return { success: true, reservationId: reservations[0].id }; // Returning first ID as group ref for simplicity
    });
  }

  async releaseStock(dto: ReleaseStockDto) {
    const reservations = await this.prisma.stockReservation.findMany({
      where: { 
         orderId: dto.orderId,
         status: 'PENDING'
      }
    });
    
    if (reservations.length === 0) {
        this.logger.warn(`No pending reservations found for order ${dto.orderId} to release.`);
        return { success: false, message: 'No reservations found' };
    }

    await this.prisma.$transaction(async (tx) => {
      for (const res of reservations) {
        // Decrease reserved count
        await tx.inventoryItem.update({
          where: { variantId: res.variantId },
          data: {
            reserved: { decrement: res.quantity },
          },
        });

        // Update reservation status
        await tx.stockReservation.update({
            where: { id: res.id },
            data: { status: 'RELEASED' } 
        });
      }
    });

    this.logger.log(`Released stock for order ${dto.orderId}`);
    return { success: true };
  }
  
  async confirmReservation(orderId: string) {
      // Called when order is PAID
      await this.prisma.stockReservation.updateMany({
          where: { orderId, status: 'PENDING' },
          data: { status: 'CONFIRMED' }
      });
      
       // Also decrement actual quantity now that it is sold? 
       // Depending on business logic, usually 'reserved' moves to 'sold' (decrement quantity, decrement reserved)
       // Let's implement that simple logic
       
       const reservations = await this.prisma.stockReservation.findMany({
           where: { orderId, status: 'CONFIRMED' } // newly confirmed
       });
       
       for(const res of reservations) {
           await this.prisma.inventoryItem.update({
               where: { variantId: res.variantId },
               data: {
                   quantity: { decrement: res.quantity },
                   reserved: { decrement: res.quantity }
               }
           });
       }
       
       this.logger.log(`Confirmed stock deduction for order ${orderId}`);
  }
}
