import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CatalogPrismaService } from '../prisma/catalog-prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductsDto } from './dto';
import { Prisma } from '.prisma/catalog-client';
import { PaginationMeta, createPaginationMeta } from '@fashion-store/shared-dto';
import { RabbitMQService, EXCHANGES, ROUTING_KEYS } from '@fashion-store/rabbitmq';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: CatalogPrismaService,
    private readonly rabbitmqService: RabbitMQService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { variants, images, ...productData } = createProductDto;

    try {
      const product = await this.prisma.product.create({
        data: {
          ...productData,
          variants: variants?.length ? {
            create: variants,
          } : undefined,
          images: images?.length ? {
            create: images,
          } : undefined,
        },
        include: {
          category: true,
          variants: true,
          images: true,
        },
      });

      this.logger.log(`Created product: ${product.id}`);
      
      // Publish event
      await this.rabbitmqService.publish(
        EXCHANGES.DOMAIN_EVENTS,
        ROUTING_KEYS.PRODUCT_CREATED,
        {
          eventId: crypto.randomUUID(),
          eventType: 'PRODUCT_CREATED',
          timestamp: new Date().toISOString(),
          correlationId: product.id, // Using product ID as correlation for now
          version: 1,
          payload: product,
        }
      );

      return product;
    } catch (error) {
      this.logger.error(`Failed to create product`, error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to create product',
      });
    }
  }

  async findAll(query: QueryProductsDto) {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      search,
      categoryId,
      isActive,
      isFeatured,
      minPrice,
      maxPrice,
      tags
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
        categoryId ? { categoryId } : {},
        isActive !== undefined ? { isActive } : {},
        isFeatured !== undefined ? { isFeatured } : {},
        minPrice ? { basePrice: { gte: minPrice } } : {},
        maxPrice ? { basePrice: { lte: maxPrice } } : {},
        tags ? { tags: { hasSome: tags } } : {},
      ],
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
          variants: true,
          images: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const meta = createPaginationMeta(page, limit, total);

    return { products, meta };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    if (!product) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Product with ID ${id} not found`,
      });
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Ensure exists

    const { variants, images, ...productData } = updateProductDto;

    // Handle variant updates/creation
    // Note: Complex nested updates usually require more sophisticated logic
    // specific to the business rules (e.g., updating stock, price of specific variant)
    // For this reference, we'll keep it simple or expand as needed.
    
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          ...productData,
        },
        include: {
          category: true,
          variants: true,
          images: true,
        },
      });

      this.logger.log(`Updated product: ${id}`);
      
      // Publish event
      await this.rabbitmqService.publish(
        EXCHANGES.DOMAIN_EVENTS,
        ROUTING_KEYS.PRODUCT_UPDATED,
        {
          eventId: crypto.randomUUID(),
          eventType: 'PRODUCT_UPDATED',
          timestamp: new Date().toISOString(),
          correlationId: id,
          version: 1,
          payload: product,
        }
      );

      return product;
    } catch (error) {
      this.logger.error(`Failed to update product ${id}`, error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to update product',
      });
    }
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists

    try {
      await this.prisma.product.delete({
        where: { id },
      });
      this.logger.log(`Deleted product: ${id}`);

      // Publish event
      await this.rabbitmqService.publish(
        EXCHANGES.DOMAIN_EVENTS,
        ROUTING_KEYS.PRODUCT_DELETED,
        {
          eventId: crypto.randomUUID(),
          eventType: 'PRODUCT_DELETED',
          timestamp: new Date().toISOString(),
          correlationId: id,
          version: 1,
          payload: { id },
        }
      );

      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}`, error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to delete product',
      });
    }
  }

  async checkAvailability(productId: string, variantId: string, quantity: number) {
    // In a real microservices architecture, this might involve checking the Inventory Service
    // via gRPC or listening to inventory events.
    // For the Catalog Service, we might only store a cached "stock status" or read-only view.
    // However, since we defined 'stockQuantity' in ProductVariant in our schema (as a cache/reference),
    // we can check that.
    
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId, productId },
    });

    if (!variant) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Product variant not found',
      });
    }

    const available = variant.stockQuantity >= quantity;

    return {
      available,
      available_quantity: variant.stockQuantity, // Mapping to snake_case for proto in controller if needed, or mapping logic handles it
      message: available ? 'In stock' : 'Insufficient stock',
    };
  }
}
