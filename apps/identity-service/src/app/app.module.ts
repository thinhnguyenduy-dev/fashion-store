import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { IdentityPrismaModule } from '../prisma/identity-prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    IdentityPrismaModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
