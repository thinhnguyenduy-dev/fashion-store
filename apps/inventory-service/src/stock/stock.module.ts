import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { StockEventsHandler } from './stock.events.handler';
import { InventoryPrismaModule } from '../prisma/inventory-prisma.module';
import { RabbitMQModule } from '@fashion-store/rabbitmq';

@Module({
  imports: [InventoryPrismaModule, RabbitMQModule],
  controllers: [StockController],
  providers: [StockService, StockEventsHandler],
  exports: [StockService],
})
export class StockModule {}
