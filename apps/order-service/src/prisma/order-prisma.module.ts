import { Module, Global } from '@nestjs/common';
import { OrderPrismaService } from './order-prisma.service';

@Global()
@Module({
  providers: [OrderPrismaService],
  exports: [OrderPrismaService],
})
export class OrderPrismaModule {}
