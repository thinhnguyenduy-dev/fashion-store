import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CatalogPrismaModule } from '../prisma/catalog-prisma.module';

import { CategoriesController } from './categories.controller';

@Module({
  imports: [CatalogPrismaModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
