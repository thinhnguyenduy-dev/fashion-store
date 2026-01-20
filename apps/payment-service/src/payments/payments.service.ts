import { Injectable, Logger } from '@nestjs/common';
import { PaymentPrismaService } from '../prisma/payment-prisma.service';
import { ProcessPaymentDto, RefundPaymentDto, PaymentProvider } from './dto';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RabbitMQService, EXCHANGES, ROUTING_KEYS } from '@fashion-store/rabbitmq';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PaymentPrismaService,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  async processPayment(dto: ProcessPaymentDto) {
    this.logger.log(`Processing payment for order ${dto.orderId}, amount: ${dto.amount}`);

    // Create Payment Record as PENDING
    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        userId: dto.userId,
        amount: new Decimal(dto.amount),
        currency: dto.currency || 'USD',
        provider: dto.provider || PaymentProvider.TEST_PROVIDER,
        status: 'PENDING',
      },
    });

    try {
      // Simulate Payment Gateway Call
      // In real world, call Stripe/PayPal API here
      const transactionId = `txn_${Date.now()}`;
      const success = Math.random() > 0.1; // 90% success rate

      if (!success) {
         throw new Error('Payment Gateway Rejected');
      }

      // Update Payment to COMPLETED
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          transactionId,
        },
      });

      this.logger.log(`Payment successful: ${updatedPayment.id}`);

      // Publish PAYMENT_COMPLETED event
      await this.rabbitmqService.publish(
        EXCHANGES.DOMAIN_EVENTS,
        ROUTING_KEYS.PAYMENT_COMPLETED,
        {
           eventId: crypto.randomUUID(),
           eventType: 'PAYMENT_COMPLETED',
           timestamp: new Date().toISOString(),
           correlationId: dto.orderId,
           version: 1,
           payload: {
               paymentId: updatedPayment.id,
               orderId: dto.orderId,
               transactionId,
               amount: dto.amount,
           }
        }
      );

      return updatedPayment;

    } catch (error: any) {
      this.logger.error(`Payment failed for order ${dto.orderId}`, error.message);

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });

      // Publish PAYMENT_FAILED event
      await this.rabbitmqService.publish(
        EXCHANGES.DOMAIN_EVENTS,
        ROUTING_KEYS.PAYMENT_FAILED,
        {
           eventId: crypto.randomUUID(),
           eventType: 'PAYMENT_FAILED',
           timestamp: new Date().toISOString(),
           correlationId: dto.orderId,
           version: 1,
           payload: {
               paymentId: payment.id,
               orderId: dto.orderId,
               reason: error.message,
           }
        }
      );
      
      throw new RpcException({
          code: status.INTERNAL,
          message: 'Payment processing failed',
      });
    }
  }

  async refundPayment(dto: RefundPaymentDto) {
      this.logger.log(`Refunding payment ${dto.paymentId} for order ${dto.orderId}`);
      
      const payment = await this.prisma.payment.findUnique({ where: { id: dto.paymentId } });
      
      if (!payment || payment.status !== 'COMPLETED') {
          throw new RpcException({
              code: status.FAILED_PRECONDITION,
              message: 'Payment not found or not eligible for refund',
          });
      }
      
      // Simulate Refund Logic
      await this.prisma.payment.update({
          where: { id: dto.paymentId },
          data: { status: 'REFUNDED' }
      });
      
      this.logger.log(`Payment ${dto.paymentId} refunded`);
      
      return { success: true };
  }
  
  async findByOrder(orderId: string) {
      return this.prisma.payment.findUnique({ where: { orderId } });
  }
}
