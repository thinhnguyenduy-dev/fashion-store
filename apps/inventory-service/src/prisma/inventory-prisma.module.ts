import { Module, Global } from '@nestjs/common';
import { InventoryPrismaService } from './inventory-prisma.service';

@Global()
@Module({
  providers: [InventoryPrismaService],
  exports: [InventoryPrismaService],
})
export class InventoryPrismaModule {}
