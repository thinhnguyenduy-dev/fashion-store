import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsEventsHandler } from './payments.events.handler';
import { PaymentPrismaModule } from '../prisma/payment-prisma.module';
import { RabbitMQModule } from '@fashion-store/rabbitmq';

@Module({
  imports: [PaymentPrismaModule, RabbitMQModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsEventsHandler],
  exports: [PaymentsService],
})
export class PaymentsModule {}
