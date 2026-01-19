import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('ApiGateway');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.API_GATEWAY_PORT || 3000;
  await app.listen(port);
  
  logger.log(`API Gateway is running on: http://localhost:${port}/api`);
}

bootstrap();
