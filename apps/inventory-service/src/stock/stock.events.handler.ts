import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { StockService } from './stock.service';
import { EXCHANGES } from '@fashion-store/rabbitmq';

@Injectable()
export class StockEventsHandler {
  private readonly logger = new Logger(StockEventsHandler.name);

  constructor(private readonly stockService: StockService) {}

  @RabbitSubscribe({
    exchange: EXCHANGES.SAGA,
    routingKey: 'saga.inventory.reserve',
    queue: 'inventory.saga.reserve',
  })
  async handleReserveStockCommand(msg: any) {
    this.logger.log(`Received RESERVE_STOCK_COMMAND for order ${msg.correlationId}`);
    try {
        await this.stockService.reserveStock({
            orderId: msg.payload.orderId,
            items: msg.payload.items
        });
        // In real saga, we would publish a 'Success' reply event here if using choreography
        // or just ack if orchestrator detects success via RPC or event.
    } catch (e) {
        this.logger.error('Failed to reserve stock', e);
        // Should publish FAILURE event for Orchestrator to compensate
    }
  }

  @RabbitSubscribe({
    exchange: EXCHANGES.SAGA,
    routingKey: 'saga.inventory.release',
    queue: 'inventory.saga.release',
  })
  async handleReleaseStockCommand(msg: any) {
    this.logger.log(`Received RELEASE_STOCK_COMMAND for order ${msg.correlationId}`);
    await this.stockService.releaseStock({
        orderId: msg.payload.orderId,
        reservationId: msg.payload.reservationId
    });
  }
}
