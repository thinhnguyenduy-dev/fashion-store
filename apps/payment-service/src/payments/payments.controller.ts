import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @GrpcMethod('PaymentService', 'ProcessPayment')
  async processPayment(data: any) {
    // This is less likely to be called directly via gRPC from Gateway,
    // usually triggered by Saga. But good for manual testing.
    return this.paymentsService.processPayment({
        orderId: data.order_id,
        userId: data.user_id,
        amount: data.amount,
        currency: data.currency,
        provider: data.provider
    });
  }

  @GrpcMethod('PaymentService', 'GetPaymentByOrder')
  async getPaymentByOrder(data: { order_id: string }) {
      return this.paymentsService.findByOrder(data.order_id);
  }
}
