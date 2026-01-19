/**
 * Order domain events
 */

export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  correlationId: string;
  version: number;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderCreatedEvent extends BaseEvent {
  eventType: 'ORDER_CREATED';
  payload: {
    orderId: string;
    userId: string;
    items: OrderItem[];
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    totals: {
      subtotal: number;
      shipping: number;
      tax: number;
      discount: number;
      total: number;
    };
  };
}

export interface OrderConfirmedEvent extends BaseEvent {
  eventType: 'ORDER_CONFIRMED';
  payload: {
    orderId: string;
    userId: string;
    paymentId: string;
    reservationId: string;
    confirmedAt: string;
  };
}

export interface OrderCancelledEvent extends BaseEvent {
  eventType: 'ORDER_CANCELLED';
  payload: {
    orderId: string;
    userId: string;
    reason: string;
    cancelledAt: string;
    refundRequired: boolean;
  };
}

export interface OrderFulfilledEvent extends BaseEvent {
  eventType: 'ORDER_FULFILLED';
  payload: {
    orderId: string;
    userId: string;
    trackingNumber?: string;
    carrier?: string;
    fulfilledAt: string;
  };
}

export type OrderEvent = 
  | OrderCreatedEvent 
  | OrderConfirmedEvent 
  | OrderCancelledEvent
  | OrderFulfilledEvent;
