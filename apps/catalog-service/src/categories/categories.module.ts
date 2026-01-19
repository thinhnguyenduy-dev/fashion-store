import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CatalogPrismaModule } from '../prisma/catalog-prisma.module';

@Module({
  imports: [CatalogPrismaModule],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
