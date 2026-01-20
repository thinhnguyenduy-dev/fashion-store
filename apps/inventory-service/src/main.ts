import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { join } from 'path';
// import { PROTO_PATHS, GRPC_PACKAGES } from '@fashion-store/proto'; // Ensure you have these imported correctly
import { AllExceptionsFilter, GrpcExceptionFilter } from '@fashion-store/shared-filters';

async function bootstrap() {
  const logger = new Logger('InventoryService');
  const app = await NestFactory.create(AppModule);

  // Global pipes and filters
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Connect gRPC microservice
  // Note: Hardcoding values momentarily to ensure correct path logic if imports fail
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'inventory', // match proto package
      protoPath: join(process.cwd(), 'libs/proto/src/lib/inventory.proto'), 
      url: `0.0.0.0:${process.env.INVENTORY_GRPC_PORT || 50052}`,
    },
  });

  // Apply gRPC specific filter globally
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.startAllMicroservices();
  
  const port = process.env.INVENTORY_SERVICE_PORT || 3003;
  await app.listen(port);
  
  logger.log(`Inventory Service is running on port ${port}`);
  logger.log(`gRPC Service is running on port ${process.env.INVENTORY_GRPC_PORT || 50052}`);
}

bootstrap();
