import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderPrismaModule } from '../prisma/order-prisma.module';
import { RabbitMQModule } from '@fashion-store/rabbitmq';

@Module({
  imports: [OrderPrismaModule, RabbitMQModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
