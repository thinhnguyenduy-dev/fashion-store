# Elite Fashion Store

A high-end e-commerce platform built with modern web technologies, featuring a microservices architecture and a premium frontend experience.

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind)
- **Language**: TypeScript

### Backend (Microservices)
- **Framework**: [NestJS](https://nestjs.com/)
- **Monorepo Tool**: [Nx](https://nx.dev/)
- **API Gateway**: NestJS
- **Services**:
  - Cart Service
  - Catalog Service
  - Identity Service
  - Inventory Service
  - Notification Service
  - Order Service
  - Payment Service
- **Database**: PostgreSQL / Prisma ORM
- **Message Broker**: RabbitMQ (implied)

### Infrastructure
- **Containerization**: Docker
- **Package Manager**: NPM

## Project Structure

```
├── apps/
│   ├── web-store/          # Next.js Frontend Application
│   ├── api-gateway/        # Backend API Gateway
│   ├── cart-service/       # Cart Management Service
│   ├── catalog-service/    # Product Catalog Service
│   ├── identity-service/   # Authentication & User Service
│   └── ...                 # Other microservices
├── libs/                   # Shared libraries
└── tools/                  # Build and dev tools
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker (for local development services)
- NPM

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Copy `.env.example` to `.env` and configure your local environment.

### Running the Application

This project uses Nx for task management.

**Start the Frontend:**
```bash
npx nx serve web-store
```
The frontend will be available at `http://localhost:3000`.

**Start the API Gateway:**
```bash
npx nx serve api-gateway
```

**Start a specific service:**
```bash
npx nx serve [service-name]
```

### Building for Production

**Build the frontend:**
```bash
npx nx build web-store
```

**Build all applications:**
```bash
npx nx run-many --target=build --all
```

## Development Features

- **Component Architecture**: The frontend uses a modular component structure with reusable UI elements (buttons, cards, inputs) and feature-specific sections.
- **Theming**: Dark mode support and custom color tokens are configured via Tailwind CSS variables.
- **Responsiveness**: Fully responsive design adapting to mobile, tablet, and desktop viewports.
