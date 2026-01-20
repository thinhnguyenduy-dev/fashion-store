import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { join } from 'path';
import { AllExceptionsFilter, GrpcExceptionFilter } from '@fashion-store/shared-filters';

async function bootstrap() {
  const logger = new Logger('PaymentService');
  const app = await NestFactory.create(AppModule);

  // Global pipes and filters
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Connect gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'payment', 
      protoPath: join(process.cwd(), 'libs/proto/src/lib/payment.proto'), 
      url: `0.0.0.0:${process.env.PAYMENT_GRPC_PORT || 50053}`,
    },
  });

  // Apply gRPC specific filter globally
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.startAllMicroservices();
  
  const port = process.env.PAYMENT_SERVICE_PORT || 3005;
  await app.listen(port);
  
  logger.log(`Payment Service is running on port ${port}`);
  logger.log(`gRPC Service is running on port ${process.env.PAYMENT_GRPC_PORT || 50053}`);
}

bootstrap();
