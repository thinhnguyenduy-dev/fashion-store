import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StockModule } from '../stock/stock.module';
import { InventoryPrismaModule } from '../prisma/inventory-prisma.module';
import { RabbitMQModule } from '@fashion-store/rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RabbitMQModule,
    InventoryPrismaModule,
    StockModule,
  ],
})
export class AppModule {}
