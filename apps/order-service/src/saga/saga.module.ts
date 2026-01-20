import { Module } from '@nestjs/common';
import { CheckoutSaga } from './checkout.saga';
import { OrdersModule } from '../orders/orders.module';
import { RabbitMQModule } from '@fashion-store/rabbitmq';

@Module({
  imports: [OrdersModule, RabbitMQModule],
  providers: [CheckoutSaga],
  exports: [CheckoutSaga],
})
export class SagaModule {}
