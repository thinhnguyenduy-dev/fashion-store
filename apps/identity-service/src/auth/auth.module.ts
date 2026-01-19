import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakService } from './keycloak.service';
// We will expose Auth functionality via RabbitMQ or specific gRPC methods if needed,
// but usually API Gateway handles token validation locally via public keys.
// Identity Service is for User Management and login/token exchange proxying.

@Module({
  imports: [ConfigModule],
  providers: [KeycloakService],
  exports: [KeycloakService],
})
export class AuthModule {}
