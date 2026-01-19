/**
 * RabbitMQ Exchange definitions
 */
export const EXCHANGES = {
  // Main domain events exchange - topic type for flexible routing
  DOMAIN_EVENTS: 'fashion-store.events',
  
  // Dead letter exchange for failed messages
  DEAD_LETTER: 'fashion-store.dlx',
  
  // Saga orchestration exchange
  SAGA: 'fashion-store.saga',
} as const;

export const EXCHANGE_TYPES = {
  TOPIC: 'topic',
  DIRECT: 'direct',
  FANOUT: 'fanout',
  HEADERS: 'headers',
} as const;

export type ExchangeName = typeof EXCHANGES[keyof typeof EXCHANGES];
