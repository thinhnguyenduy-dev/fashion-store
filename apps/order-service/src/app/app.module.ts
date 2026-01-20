import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from '../orders/orders.module';
import { SagaModule } from '../saga/saga.module';
import { OrderPrismaModule } from '../prisma/order-prisma.module';
import { RabbitMQModule } from '@fashion-store/rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RabbitMQModule,
    OrderPrismaModule,
    OrdersModule,
    SagaModule,
  ],
})
export class AppModule {}
