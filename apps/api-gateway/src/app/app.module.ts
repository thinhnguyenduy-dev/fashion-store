import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from '../routes/auth.controller';
import { GRPC_SERVICES, GRPC_PACKAGES, PROTO_PATHS } from '@fashion-store/proto';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync([
      {
        name: GRPC_SERVICES.USER_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_PACKAGES.USER,
            protoPath: join(process.cwd(), PROTO_PATHS.USER),
            url: configService.get<string>('IDENTITY_GRPC_URL', 'localhost:50051'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_SERVICES.AUTH_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_PACKAGES.AUTH,
            protoPath: join(process.cwd(), PROTO_PATHS.AUTH),
            url: configService.get<string>('IDENTITY_GRPC_URL', 'localhost:50051'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
