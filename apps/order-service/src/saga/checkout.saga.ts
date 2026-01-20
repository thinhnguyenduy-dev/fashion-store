import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService, EXCHANGES, ROUTING_KEYS, QUEUES } from '@fashion-store/rabbitmq';
import { OrdersService } from '../orders/orders.service';
import { OrderStatusEnum } from '../orders/dto';

/**
 * Checkout Saga Orchestrator
 * 
 * Coordinates the checkout flow across multiple services:
 * 1. Reserve Stock (Inventory Service)
 * 2. Process Payment (Payment Service)
 * 3. Confirm Order
 * 
 * On failure at any step, compensating transactions are triggered.
 */
@Injectable()
export class CheckoutSaga {
  private readonly logger = new Logger(CheckoutSaga.name);

  constructor(
    private readonly rabbitmqService: RabbitMQService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Start the checkout saga for an order
   */
  async startCheckout(orderId: string, userId: string, items: any[], totalAmount: number) {
    this.logger.log(`Starting checkout saga for order: ${orderId}`);

    const sagaState = {
      orderId,
      userId,
      items,
      totalAmount,
      step: 'RESERVE_STOCK',
      reservationId: null as string | null,
      paymentId: null as string | null,
    };

    try {
      // Step 1: Reserve Stock
      await this.reserveStock(sagaState);
    } catch (error) {
      this.logger.error(`Checkout saga failed at step ${sagaState.step}`, error);
      await this.compensate(sagaState);
    }
  }

  /**
   * Step 1: Reserve stock in Inventory Service
   */
  private async reserveStock(sagaState: any) {
    this.logger.log(`[Saga ${sagaState.orderId}] Reserving stock...`);

    // Publish command to Inventory Service
    await this.rabbitmqService.publish(
      EXCHANGES.SAGA,
      'saga.inventory.reserve',
      {
        eventId: crypto.randomUUID(),
        eventType: 'RESERVE_STOCK_COMMAND',
        timestamp: new Date().toISOString(),
        correlationId: sagaState.orderId,
        payload: {
          orderId: sagaState.orderId,
          items: sagaState.items.map((i: any) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        },
      },
    );

    // In a real implementation, we would wait for a reply via RabbitMQ
    // For this reference implementation, we simulate success
    sagaState.reservationId = `res-${sagaState.orderId}`;
    sagaState.step = 'PROCESS_PAYMENT';

    // Continue to next step
    await this.processPayment(sagaState);
  }

  /**
   * Step 2: Process payment via Payment Service
   */
  private async processPayment(sagaState: any) {
    this.logger.log(`[Saga ${sagaState.orderId}] Processing payment...`);

    // Publish command to Payment Service
    await this.rabbitmqService.publish(
      EXCHANGES.SAGA,
      'saga.payment.process',
      {
        eventId: crypto.randomUUID(),
        eventType: 'PROCESS_PAYMENT_COMMAND',
        timestamp: new Date().toISOString(),
        correlationId: sagaState.orderId,
        payload: {
          orderId: sagaState.orderId,
          userId: sagaState.userId,
          amount: sagaState.totalAmount,
          reservationId: sagaState.reservationId,
        },
      },
    );

    // Simulate success
    sagaState.paymentId = `pay-${sagaState.orderId}`;
    sagaState.step = 'CONFIRM_ORDER';

    // Continue to next step
    await this.confirmOrder(sagaState);
  }

  /**
   * Step 3: Confirm the order
   */
  private async confirmOrder(sagaState: any) {
    this.logger.log(`[Saga ${sagaState.orderId}] Confirming order...`);

    await this.ordersService.updateStatus({
      id: sagaState.orderId,
      status: OrderStatusEnum.CONFIRMED,
      changedBy: 'saga',
    });

    // Update order with payment and reservation IDs
    // This would normally be done via a dedicated update method

    this.logger.log(`[Saga ${sagaState.orderId}] Checkout saga completed successfully!`);
  }

  /**
   * Compensating transactions for saga failure
   */
  private async compensate(sagaState: any) {
    this.logger.warn(`[Saga ${sagaState.orderId}] Running compensation...`);

    // Compensate based on how far we got
    if (sagaState.paymentId) {
      // Refund payment
      await this.rabbitmqService.publish(
        EXCHANGES.SAGA,
        'saga.payment.refund',
        {
          eventId: crypto.randomUUID(),
          eventType: 'REFUND_PAYMENT_COMMAND',
          timestamp: new Date().toISOString(),
          correlationId: sagaState.orderId,
          payload: {
            orderId: sagaState.orderId,
            paymentId: sagaState.paymentId,
          },
        },
      );
    }

    if (sagaState.reservationId) {
      // Release stock reservation
      await this.rabbitmqService.publish(
        EXCHANGES.SAGA,
        'saga.inventory.release',
        {
          eventId: crypto.randomUUID(),
          eventType: 'RELEASE_STOCK_COMMAND',
          timestamp: new Date().toISOString(),
          correlationId: sagaState.orderId,
          payload: {
            orderId: sagaState.orderId,
            reservationId: sagaState.reservationId,
          },
        },
      );
    }

    // Cancel the order
    await this.ordersService.updateStatus({
      id: sagaState.orderId,
      status: OrderStatusEnum.CANCELLED,
      reason: 'Saga compensation - checkout failed',
      changedBy: 'saga',
    });

    this.logger.warn(`[Saga ${sagaState.orderId}] Compensation completed.`);
  }
}
