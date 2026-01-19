/**
 * RabbitMQ Routing Key definitions
 * Format: domain.entity.action
 */
export const ROUTING_KEYS = {
  // Order events
  ORDER_CREATED: 'order.order.created',
  ORDER_CONFIRMED: 'order.order.confirmed',
  ORDER_CANCELLED: 'order.order.cancelled',
  ORDER_FULFILLED: 'order.order.fulfilled',
  ORDER_SHIPPED: 'order.order.shipped',
  ORDER_DELIVERED: 'order.order.delivered',
  
  // Payment events
  PAYMENT_INITIATED: 'payment.payment.initiated',
  PAYMENT_COMPLETED: 'payment.payment.completed',
  PAYMENT_FAILED: 'payment.payment.failed',
  REFUND_INITIATED: 'payment.refund.initiated',
  REFUND_COMPLETED: 'payment.refund.completed',
  
  // Inventory events
  STOCK_RESERVED: 'inventory.stock.reserved',
  STOCK_RELEASED: 'inventory.stock.released',
  STOCK_CONFIRMED: 'inventory.stock.confirmed',
  STOCK_LOW: 'inventory.stock.low',
  STOCK_UPDATED: 'inventory.stock.updated',
  
  // Product events
  PRODUCT_CREATED: 'catalog.product.created',
  PRODUCT_UPDATED: 'catalog.product.updated',
  PRODUCT_DELETED: 'catalog.product.deleted',
  PRICE_CHANGED: 'catalog.product.price-changed',
  
  // User events
  USER_REGISTERED: 'identity.user.registered',
  USER_UPDATED: 'identity.user.updated',
  
  // Saga events
  SAGA_CHECKOUT_START: 'saga.checkout.start',
  SAGA_CHECKOUT_COMPENSATE: 'saga.checkout.compensate',
  
  // Wildcard patterns for subscriptions
  ALL_ORDER_EVENTS: 'order.#',
  ALL_PAYMENT_EVENTS: 'payment.#',
  ALL_INVENTORY_EVENTS: 'inventory.#',
  ALL_CATALOG_EVENTS: 'catalog.#',
} as const;

export type RoutingKey = typeof ROUTING_KEYS[keyof typeof ROUTING_KEYS];
