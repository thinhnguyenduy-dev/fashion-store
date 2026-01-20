import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { PaymentsService } from './payments.service';
import { EXCHANGES } from '@fashion-store/rabbitmq';

@Injectable()
export class PaymentsEventsHandler {
  private readonly logger = new Logger(PaymentsEventsHandler.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @RabbitSubscribe({
    exchange: EXCHANGES.SAGA,
    routingKey: 'saga.payment.process',
    queue: 'payment.saga.process',
  })
  async handleProcessPaymentCommand(msg: any) {
    this.logger.log(`Received PROCESS_PAYMENT_COMMAND for order ${msg.correlationId}`);
    try {
        await this.paymentsService.processPayment({
            orderId: msg.payload.orderId,
            userId: msg.payload.userId,
            amount: msg.payload.amount,
            // provider: msg.payload.provider // optional
        });
    } catch (e) {
        this.logger.error('Failed to process payment via saga', e);
        // Failure event is already published by service
    }
  }

  @RabbitSubscribe({
    exchange: EXCHANGES.SAGA,
    routingKey: 'saga.payment.refund',
    queue: 'payment.saga.refund',
  })
  async handleRefundPaymentCommand(msg: any) {
    this.logger.log(`Received REFUND_PAYMENT_COMMAND for order ${msg.correlationId}`);
    await this.paymentsService.refundPayment({
        orderId: msg.payload.orderId,
        paymentId: msg.payload.paymentId
    });
  }
}
