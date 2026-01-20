import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { GRPC_SERVICES } from '@fashion-store/proto'; // Assuming INVENTORY_SERVICE is defined there

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @GrpcMethod('InventoryService', 'GetStock')
  async getStock(data: { product_id: string; variant_id?: string }) {
    const items = await this.stockService.getStock(data.product_id, data.variant_id);
    return {
      items: items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        sku: item.sku,
        quantity: item.quantity,
        reserved: item.reserved,
        available: item.quantity - item.reserved
      }))
    };
  }

  // ReserveStock is usually called via Saga (RabbitMQ) but we expose gRPC for check/sync calls if needed
  @GrpcMethod('InventoryService', 'ReserveStock')
  async reserveStock(data: any) {
     return this.stockService.reserveStock({
         orderId: data.order_id,
         items: data.items.map((i: any) => ({
             productId: i.product_id,
             variantId: i.variant_id,
             sku: i.sku,
             quantity: i.quantity
         }))
     });
  }
}
