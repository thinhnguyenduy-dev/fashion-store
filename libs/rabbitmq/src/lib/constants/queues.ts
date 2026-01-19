/**
 * RabbitMQ Queue definitions
 */
export const QUEUES = {
  // Order service queues
  ORDER_CREATED: 'order.created.queue',
  ORDER_CONFIRMED: 'order.confirmed.queue',
  ORDER_CANCELLED: 'order.cancelled.queue',
  ORDER_SAGA: 'order.saga.queue',
  
  // Payment service queues
  PAYMENT_PROCESS: 'payment.process.queue',
  PAYMENT_COMPLETED: 'payment.completed.queue',
  PAYMENT_FAILED: 'payment.failed.queue',
  REFUND_PROCESS: 'refund.process.queue',
  
  // Inventory service queues
  STOCK_RESERVE: 'inventory.reserve.queue',
  STOCK_RELEASE: 'inventory.release.queue',
  STOCK_CONFIRM: 'inventory.confirm.queue',
  LOW_STOCK_ALERT: 'inventory.low-stock.queue',
  
  // Notification service queues
  NOTIFICATION_EMAIL: 'notification.email.queue',
  NOTIFICATION_SMS: 'notification.sms.queue',
  NOTIFICATION_PUSH: 'notification.push.queue',
  
  // Search service queues
  SEARCH_INDEX: 'search.index.queue',
  SEARCH_DELETE: 'search.delete.queue',
  
  // Dead letter queues
  DLQ_ORDER: 'dlq.order.queue',
  DLQ_PAYMENT: 'dlq.payment.queue',
  DLQ_INVENTORY: 'dlq.inventory.queue',
} as const;

export type QueueName = typeof QUEUES[keyof typeof QUEUES];
