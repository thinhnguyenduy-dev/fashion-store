import { BaseEvent } from './order.events';

/**
 * Payment domain events
 */

export interface PaymentInitiatedEvent extends BaseEvent {
  eventType: 'PAYMENT_INITIATED';
  payload: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    provider: string;
  };
}

export interface PaymentCompletedEvent extends BaseEvent {
  eventType: 'PAYMENT_COMPLETED';
  payload: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    transactionId: string;
    completedAt: string;
  };
}

export interface PaymentFailedEvent extends BaseEvent {
  eventType: 'PAYMENT_FAILED';
  payload: {
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    errorCode: string;
    errorMessage: string;
    failedAt: string;
  };
}

export interface RefundInitiatedEvent extends BaseEvent {
  eventType: 'REFUND_INITIATED';
  payload: {
    refundId: string;
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    reason: string;
  };
}

export interface RefundCompletedEvent extends BaseEvent {
  eventType: 'REFUND_COMPLETED';
  payload: {
    refundId: string;
    paymentId: string;
    orderId: string;
    userId: string;
    amount: number;
    transactionId: string;
    completedAt: string;
  };
}

export type PaymentEvent = 
  | PaymentInitiatedEvent 
  | PaymentCompletedEvent 
  | PaymentFailedEvent
  | RefundInitiatedEvent
  | RefundCompletedEvent;
