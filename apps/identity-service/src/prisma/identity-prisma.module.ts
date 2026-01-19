import { Module, Global } from '@nestjs/common';
import { IdentityPrismaService } from './identity-prisma.service';

@Global()
@Module({
  providers: [IdentityPrismaService],
  exports: [IdentityPrismaService],
})
export class IdentityPrismaModule {}
