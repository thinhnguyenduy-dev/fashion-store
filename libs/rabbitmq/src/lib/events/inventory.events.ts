import { BaseEvent } from './order.events';

/**
 * Inventory domain events
 */

export interface StockReservationItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface StockReservedEvent extends BaseEvent {
  eventType: 'STOCK_RESERVED';
  payload: {
    reservationId: string;
    orderId: string;
    items: StockReservationItem[];
    expiresAt: string;
  };
}

export interface StockReleasedEvent extends BaseEvent {
  eventType: 'STOCK_RELEASED';
  payload: {
    reservationId: string;
    orderId: string;
    items: StockReservationItem[];
    reason: string;
    releasedAt: string;
  };
}

export interface StockConfirmedEvent extends BaseEvent {
  eventType: 'STOCK_CONFIRMED';
  payload: {
    reservationId: string;
    orderId: string;
    items: StockReservationItem[];
    confirmedAt: string;
  };
}

export interface LowStockAlertEvent extends BaseEvent {
  eventType: 'LOW_STOCK_ALERT';
  payload: {
    productId: string;
    variantId: string;
    productName: string;
    sku: string;
    currentQuantity: number;
    threshold: number;
    alertedAt: string;
  };
}

export interface StockUpdatedEvent extends BaseEvent {
  eventType: 'STOCK_UPDATED';
  payload: {
    productId: string;
    variantId: string;
    previousQuantity: number;
    newQuantity: number;
    operation: 'ADD' | 'SUBTRACT' | 'SET';
    reason?: string;
    updatedAt: string;
  };
}

export type InventoryEvent = 
  | StockReservedEvent 
  | StockReleasedEvent 
  | StockConfirmedEvent
  | LowStockAlertEvent
  | StockUpdatedEvent;
