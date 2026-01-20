import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CatalogPrismaService } from '../prisma/catalog-prisma.service';
import { Prisma } from '.prisma/catalog-client';

@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: CatalogPrismaService) {}

  async onModuleInit() {
    await this.seedDefaultCategories();
  }

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: { children: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  private async seedDefaultCategories() {
    const count = await this.prisma.category.count();
    if (count > 0) return;

    this.logger.log('Seeding default categories...');

    const categories = [
      { name: 'Men', slug: 'men' },
      { name: 'Women', slug: 'women' },
      { name: 'Accessories', slug: 'accessories' },
    ];

    for (const cat of categories) {
      await this.prisma.category.create({
        data: cat,
      });
    }

    this.logger.log('Default categories seeded.');
  }
}
