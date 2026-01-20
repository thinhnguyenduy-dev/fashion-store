import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from '../routes/auth.controller';
import { ProductsController } from '../routes/products.controller';
import { AdminProductsController } from '../routes/admin-products.controller';
import { AdminCategoriesController } from '../routes/admin-categories.controller';
import { OrdersController } from '../routes/orders.controller';
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
      {
        name: GRPC_SERVICES.PRODUCT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_PACKAGES.PRODUCT,
            protoPath: join(process.cwd(), PROTO_PATHS.PRODUCT),
            url: configService.get<string>('CATALOG_GRPC_URL', 'localhost:50052'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_SERVICES.ORDER_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_PACKAGES.ORDER,
            protoPath: join(process.cwd(), PROTO_PATHS.ORDER),
            url: configService.get<string>('ORDER_GRPC_URL', 'localhost:50054'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: GRPC_SERVICES.CATEGORY_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: GRPC_PACKAGES.CATEGORY,
            protoPath: join(process.cwd(), PROTO_PATHS.CATEGORY),
            url: configService.get<string>('CATALOG_GRPC_URL', 'localhost:50052'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController, ProductsController, AdminProductsController, AdminCategoriesController, OrdersController],
  providers: [],
})
export class AppModule {}
