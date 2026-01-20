import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from '../payments/payments.module';
import { PaymentPrismaModule } from '../prisma/payment-prisma.module';
import { RabbitMQModule } from '@fashion-store/rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RabbitMQModule,
    PaymentPrismaModule,
    PaymentsModule,
  ],
})
export class AppModule {}
