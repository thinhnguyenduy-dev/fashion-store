# Fashion Store - RabbitMQ Architecture

## Overview

We use usage of RabbitMQ to implement **Event-Driven Architecture** and the **Saga Pattern** for distributed transactions. This decouples microservices and ensures eventual consistency across the system.

## Core Concepts

### 1. Exchanges

We use three primary exchanges defined in `libs/rabbitmq/src/lib/constants/exchanges.ts`:

| Exchange Name | Type | Purpose |
|--------------|------|---------|
| `fashion-store.events` | `TOPIC` | **Main Domain Events**. Services publish events here (e.g., `ORDER_CREATED`). |
| `fashion-store.saga` | `DIRECT` | **Orchestration**. Used for Saga commands and replies (e.g., `ReserveStock`). |
| `fashion-store.dlx` | `DIRECT` | **Dead Letter Exchange**. Captures failed messages for retry/inspection. |

### 2. Event Structure

All events follow a standard envelope defined in `libs/rabbitmq`:

```typescript
interface BaseEvent {
  eventId: string;      // Unique UUID
  eventType: string;    // e.g. 'PRODUCT_CREATED'
  timestamp: string;    // ISO string
  correlationId: string;// Trace ID for tracking flows
  version: number;      // Schema version
  payload: any;         // Domain data
}
```

### 3. Routing Keys

We use a hierarchical routing key format: `<domain>.<entity>.<action>`

**Examples:**
- `key: 'catalog.product.created'` -> Product created in Catalog Service
- `key: 'order.order.created'` -> Order created in Order Service

Consumers can subscribe using wildcards:
- `catalog.product.*` -> All product events
- `order.#` -> All order events

## Implementation Details

### Shared Library (`@fashion-store/rabbitmq`)

Located in `libs/rabbitmq`, this library provides:

1.  **RabbitMQService**: Global service for connecting and publishing.
2.  **Constants**: Centralized Exchanges, Queues, and Routing Keys.
3.  **Types**: TypeScript interfaces for all domain events.

### Usage Example

**Publishing an Event (in a Service):**

```typescript
import { RabbitMQService, EXCHANGES, ROUTING_KEYS } from '@fashion-store/rabbitmq';

// Inject RabbitMQService
await this.rabbitMQService.publish(
  EXCHANGES.DOMAIN_EVENTS,
  ROUTING_KEYS.PRODUCT_CREATED,
  {
      eventId: uuid(),
      eventType: 'PRODUCT_CREATED',
      payload: productData,
      // ...
  }
);
```

**Consuming an Event (in a Service):**

NestJS Microservice Controller style:

```typescript
@EventPattern(ROUTING_KEYS.PRODUCT_CREATED)
async handleProductCreated(@Payload() data: ProductCreatedEvent) {
  // Handle event
}
```

## Workflows

### 1. Saga Pattern (Checkout)
Used when a transaction spans multiple services (Order -> Payment -> Inventory).

1.  **Order Service** creates PENDING order and publishes `ORDER_CREATED`.
2.  **Saga Orchestrator** listens and sends commands:
    *   -> **Inventory**: Reserve Stock
    *   -> **Payment**: Process Payment
3.  If any step fails, Orchestrator sends **Compensating Transactions** (e.g., Release Stock, Refund).

### 2. Data Synchronization (CQRS)
Used to update read models.

*   **Catalog Service** updates a product -> publishes `PRODUCT_UPDATED`.
*   **Search Service** listens -> updates Elasticsearch index.
