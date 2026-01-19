import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { join } from 'path';
import { PROTO_PATHS, GRPC_PACKAGES } from '@fashion-store/proto';
import { AllExceptionsFilter, GrpcExceptionFilter } from '@fashion-store/shared-filters';

async function bootstrap() {
  const logger = new Logger('IdentityService');
  const app = await NestFactory.create(AppModule);

  // Global pipes and filters
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  // Connect gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: GRPC_PACKAGES.USER,
      protoPath: join(process.cwd(), PROTO_PATHS.USER),
      url: `0.0.0.0:${process.env.IDENTITY_GRPC_PORT || 50051}`,
    },
  });

  // Apply gRPC specific filter globally
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.startAllMicroservices();
  
  const port = process.env.IDENTITY_SERVICE_PORT || 3001;
  await app.listen(port);
  
  logger.log(`Identity Service is running on port ${port}`);
  logger.log(`gRPC Service is running on port ${process.env.IDENTITY_GRPC_PORT || 50051}`);
}

bootstrap();
