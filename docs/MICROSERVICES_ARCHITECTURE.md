# Fashion Store - Microservices Architecture

## Overview

The Fashion Store platform is built on a **microservices architecture** using **NestJS** within an **Nx monorepo**. Services communicate via **gRPC** for synchronous operations and **RabbitMQ** for asynchronous event-driven workflows.

## Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                              CLIENT LAYER                                       |
|  +------------------------------------------------------------------------+     |
|  |                         Web Store (Next.js)                            |     |
|  |                      Frontend Application                              |     |
|  |                    http://localhost:3000                               |     |
|  +-----------------------------------+------------------------------------+     |
+------------------------------------- | --------------------------------------+
                                       | HTTP/REST
                                       v
+---------------------------------------------------------------------------------+
|                            GATEWAY LAYER                                        |
|  +------------------------------------------------------------------------+     |
|  |                       API Gateway (NestJS)                             |     |
|  |                     http://localhost:3001                              |     |
|  |                                                                        |     |
|  |  Routes:                                                               |     |
|  |  |-- /api/auth/*         -> Identity Service                          |     |
|  |  |-- /api/products/*     -> Catalog Service                           |     |
|  |  |-- /api/categories/*   -> Catalog Service                           |     |
|  |  |-- /api/orders/*       -> Order Service                             |     |
|  |  +-- /api/admin/*        -> Admin endpoints                           |     |
|  +-----------------------------------+------------------------------------+     |
+------------------------------------- | --------------------------------------+
                                       | gRPC
                                       v
+---------------------------------------------------------------------------------+
|                           MICROSERVICES LAYER                                   |
|                                                                                 |
|  +-----------------+  +-----------------+  +-----------------+                  |
|  | Identity Service|  | Catalog Service |  |  Order Service  |                  |
|  |   (port 50051)  |  |   (port 50052)  |  |   (port 50054)  |                  |
|  |                 |  |                 |  |                 |                  |
|  | * User CRUD     |  | * Products      |  | * Order CRUD    |                  |
|  | * Auth (Firebase|  | * Categories    |  | * Saga Orchest. |                  |
|  | * Profiles      |  | * Search        |  | * Status Mgmt   |                  |
|  +--------+--------+  +--------+--------+  +--------+--------+                  |
|           |                    |                    |                           |
|  +--------+--------+  +--------+--------+  +--------+--------+                  |
|  |Inventory Service|  | Payment Service |  |Notification Svc |                  |
|  |   (port 50053)  |  |   (port 50055)  |  |   (port 50056)  |                  |
|  |                 |  |                 |  |                 |                  |
|  | * Stock Levels  |  | * Payment Proc. |  | * Email         |                  |
|  | * Reservations  |  | * Refunds       |  | * Push Notif.   |                  |
|  | * Adjustments   |  | * Transactions  |  | * SMS           |                  |
|  +--------+--------+  +--------+--------+  +--------+--------+                  |
|           |                    |                    |                           |
+-----------+--------------------+--------------------+---------------------------+
            |                    |                    |
            +--------------------+--------------------+
                                 | Event Publishing/Subscribing
                                 v
+---------------------------------------------------------------------------------+
|                          MESSAGE BROKER LAYER                                   |
|  +------------------------------------------------------------------------+     |
|  |                          RabbitMQ                                      |     |
|  |                                                                        |     |
|  |  Exchanges:                                                            |     |
|  |  |-- fashion-store.events  (TOPIC)   -> Domain Events                  |     |
|  |  |-- fashion-store.saga    (DIRECT)  -> Saga Commands/Replies          |     |
|  |  +-- fashion-store.dlx     (DIRECT)  -> Dead Letter Queue              |     |
|  +------------------------------------------------------------------------+     |
+---------------------------------------------------------------------------------+
                                 |
                                 v
+---------------------------------------------------------------------------------+
|                            DATA LAYER                                           |
|  +-------------------------------+   +---------------------------------+        |
|  |        PostgreSQL             |   |            Redis                |        |
|  |     (Prisma ORM)              |   |         (Sessions/Cache)        |        |
|  |                               |   |                                 |        |
|  |  Databases per service:       |   |                                 |        |
|  |  * identity_db                |   |                                 |        |
|  |  * catalog_db                 |   |                                 |        |
|  |  * order_db                   |   |                                 |        |
|  |  * inventory_db               |   |                                 |        |
|  |  * payment_db                 |   |                                 |        |
|  +-------------------------------+   +---------------------------------+        |
+---------------------------------------------------------------------------------+
```

## Services Overview

| Service | Port | Protocol | Responsibilities |
|---------|------|----------|------------------|
| **API Gateway** | 3001 (HTTP) | REST | Routes requests, aggregates responses, handles authentication |
| **Identity Service** | 50051 | gRPC | User management, Firebase auth integration, profiles |
| **Catalog Service** | 50052 | gRPC | Products, categories, search functionality |
| **Inventory Service** | 50053 | gRPC | Stock levels, reservations, adjustments |
| **Order Service** | 50054 | gRPC | Order processing, saga orchestration |
| **Payment Service** | 50055 | gRPC | Payment processing, refunds, transactions |
| **Notification Service** | 50056 | gRPC | Email, push notifications, SMS |

## Communication Patterns

### 1. Synchronous Communication (gRPC)

```
+----------+       HTTP        +-------------+       gRPC        +------------------+
|  Client  | ---------------->| API Gateway |----------------->| Backend Service  |
|          | <----------------+             |<-----------------+                  |
+----------+                   +-------------+                   +------------------+
```

**Flow:**
1. Client sends HTTP request to API Gateway
2. Gateway routes to appropriate service via gRPC
3. Service processes request and returns response
4. Gateway transforms and returns HTTP response

### 2. Asynchronous Communication (RabbitMQ)

```
+------------------+                    +--------------------+
|  Order Service   |                    | Inventory Service  |
|                  |                    |                    |
| publish(ORDER_   |    RabbitMQ        | subscribe(ORDER_   |
| CREATED)    -----+------------------>| CREATED)           |
|                  |  fashion-store.    |                    |
+------------------+  events exchange   +--------------------+
```

**Used for:**
- Event broadcasting between services
- Eventual consistency updates
- Saga pattern orchestration

## Request Flow Examples

### User Registration Flow

```
+--------+     +-------------+     +------------------+     +------------+
| Client |     | API Gateway |     | Identity Service |     | PostgreSQL |
+---+----+     +------+------+     +--------+---------+     +-----+------+
    |                 |                     |                     |
    | POST /api/auth  |                     |                     |
    | /register       |                     |                     |
    |---------------->|                     |                     |
    |                 |                     |                     |
    |                 |  gRPC: CreateUser   |                     |
    |                 |-------------------->|                     |
    |                 |                     |                     |
    |                 |                     |  INSERT user        |
    |                 |                     |-------------------->|
    |                 |                     |                     |
    |                 |                     |<--------------------|
    |                 |                     |                     |
    |                 |<--------------------|                     |
    |                 |    User Created     |                     |
    |                 |                     |                     |
    |<----------------|                     |                     |
    |   HTTP 201      |                     |                     |
    |                 |                     |                     |
```

### Checkout Flow (Saga Pattern)

```
+--------+   +-------------+   +---------------+   +-----------+   +-----------------+
| Client |   | API Gateway |   | Order Service |   | RabbitMQ  |   |Inventory/Payment|
+---+----+   +------+------+   +-------+-------+   +-----+-----+   +--------+--------+
    |               |                  |                 |                  |
    | POST /orders  |                  |                 |                  |
    |-------------->|                  |                 |                  |
    |               |                  |                 |                  |
    |               | gRPC: CreateOrder|                 |                  |
    |               |----------------->|                 |                  |
    |               |                  |                 |                  |
    |               |                  | 1. Create PENDING order            |
    |               |                  |-----------------------------+      |
    |               |                  |                             |      |
    |               |                  |<----------------------------+      |
    |               |                  |                 |                  |
    |               |                  | 2. Publish ORDER_CREATED           |
    |               |                  |---------------->|                  |
    |               |                  |                 |                  |
    |               |                  |                 | 3. Deliver to    |
    |               |                  |                 |    subscribers   |
    |               |                  |                 |----------------->|
    |               |                  |                 |                  |
    |               |                  |                 |                  |
    |               |                  |                 |  4a. Reserve     |
    |               |                  |                 |      Stock       |
    |               |                  |                 |<-----------------|
    |               |                  |                 |                  |
    |               |                  |<----------------|                  |
    |               |                  | 5. STOCK_RESERVED                  |
    |               |                  |                 |                  |
    |               |                  |                 |  4b. Process     |
    |               |                  |                 |      Payment     |
    |               |                  |                 |<-----------------|
    |               |                  |                 |                  |
    |               |                  |<----------------|                  |
    |               |                  | 6. PAYMENT_COMPLETE                |
    |               |                  |                 |                  |
    |               |                  | 7. Update Order |                  |
    |               |                  |    Status=PAID  |                  |
    |               |                  |-----------------------------+      |
    |               |                  |                             |      |
    |               |                  |<----------------------------+      |
    |               |                  |                 |                  |
    |               |<-----------------|                 |                  |
    |<--------------|   Order Response |                 |                  |
    |  HTTP 201     |                  |                 |                  |
```

### Saga Compensation Flow (Failure Scenario)

```
+---------------+         +-----------+         +-------------------+
| Order Service |         | RabbitMQ  |         | Inventory/Payment |
+-------+-------+         +-----+-----+         +---------+---------+
        |                       |                         |
        | ORDER_CREATED         |                         |
        |---------------------->|                         |
        |                       |------------------------>|
        |                       |                         |
        |                       |       STOCK_RESERVED    |
        |                       |<------------------------|
        |<----------------------|                         |
        |                       |                         |
        |                       |                         |
        |                       |       PAYMENT_FAILED    |     <-- Payment fails
        |                       |<------------------------|
        |<----------------------|                         |
        |                       |                         |
        |                       |                         |
        | RELEASE_STOCK         | <-- Compensating action |
        |---------------------->|                         |
        |                       |------------------------>|
        |                       |                         |
        |                       |       STOCK_RELEASED    |
        |                       |<------------------------|
        |<----------------------|                         |
        |                       |                         |
        | Update Order          |                         |
        | Status=FAILED         |                         |
        |                       |                         |
```

## Shared Libraries

Located in `libs/`:

| Library | Path | Purpose |
|---------|------|---------|
| **proto** | `libs/proto` | gRPC protocol buffer definitions |
| **rabbitmq** | `libs/rabbitmq` | RabbitMQ client, event types, constants |
| **prisma-client** | `libs/prisma-client` | Shared Prisma configurations |
| **shared** | `libs/shared` | Common utilities, types, DTOs |

## gRPC Protocol Definitions

Located in `libs/proto/src/lib/`:

| Proto File | Service Definition |
|------------|-------------------|
| `user.proto` | User CRUD operations |
| `auth.proto` | Authentication operations |
| `product.proto` | Product management |
| `category.proto` | Category management |
| `order.proto` | Order operations |
| `inventory.proto` | Stock management |
| `payment.proto` | Payment processing |

## Database Architecture

Each service maintains its own database (Database-per-Service pattern):

```
+-------------------------------------------------------------+
|                      PostgreSQL Server                      |
|                                                             |
|  +---------------+ +---------------+ +---------------+      |
|  |  identity_db  | |  catalog_db   | |   order_db    |      |
|  +---------------+ +---------------+ +---------------+      |
|  | * users       | | * products    | | * orders      |      |
|  | * profiles    | | * categories  | | * order_items |      |
|  | * sessions    | | * variants    | | * statuses    |      |
|  +---------------+ +---------------+ +---------------+      |
|                                                             |
|  +---------------+ +---------------+                        |
|  | inventory_db  | |  payment_db   |                        |
|  +---------------+ +---------------+                        |
|  | * stock       | | * payments    |                        |
|  | * reservations| | * transactions|                        |
|  | * adjustments | | * refunds     |                        |
|  +---------------+ +---------------+                        |
+-------------------------------------------------------------+
```

## Development Commands

```bash
# Start all services
npx nx run-many --target=serve --all

# Start specific service
npx nx serve api-gateway
npx nx serve identity-service
npx nx serve catalog-service

# Build all
npx nx run-many --target=build --all

# Generate Prisma client
npx nx run prisma-client:generate
```

## Port Reference

| Service | HTTP Port | gRPC Port |
|---------|-----------|-----------|
| Web Store | 3000 | - |
| API Gateway | 3001 | - |
| Identity Service | - | 50051 |
| Catalog Service | - | 50052 |
| Inventory Service | - | 50053 |
| Order Service | - | 50054 |
| Payment Service | - | 50055 |
| Notification Service | - | 50056 |
| PostgreSQL | 5432 | - |
| RabbitMQ | 5672 (15672 mgmt) | - |
| Redis | 6379 | - |
