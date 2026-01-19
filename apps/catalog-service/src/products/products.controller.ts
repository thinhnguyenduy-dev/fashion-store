import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, QueryProductsDto } from './dto';
import { GRPC_SERVICES } from '@fashion-store/proto';
import { status } from '@grpc/grpc-js';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod(GRPC_SERVICES.PRODUCT_SERVICE, 'Create')
  async create(data: CreateProductDto) {
    const product = await this.productsService.create(data);
    return this.mapToProto(product);
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT_SERVICE, 'FindAll')
  async findAll(query: any) {
    // Map gRPC request fields to DTO
    const queryDto = new QueryProductsDto();
    Object.assign(queryDto, {
      ...query,
      sortBy: query.sort_by,
      sortOrder: query.sort_order,
      categoryId: query.category_id,
      minPrice: query.min_price,
      maxPrice: query.max_price
    });
    
    const { products, meta } = await this.productsService.findAll(queryDto);
    
    return {
      products: products.map(this.mapToProto),
      meta: {
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
        total_pages: meta.totalPages,
        has_next_page: meta.hasNextPage,
        has_previous_page: meta.hasPreviousPage
      }
    };
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT_SERVICE, 'FindOne')
  async findOne(data: { id: string }) {
    const product = await this.productsService.findOne(data.id);
    return this.mapToProto(product);
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT_SERVICE, 'Update')
  async update(data: UpdateProductDto) {
    const { id, ...updateData } = data;
    if (!id) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Product ID is required',
      });
    }
    const product = await this.productsService.update(id, updateData);
    return this.mapToProto(product);
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT_SERVICE, 'Delete')
  async remove(data: { id: string }) {
    return this.productsService.remove(data.id);
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT_SERVICE, 'CheckAvailability')
  async checkAvailability(data: { product_id: string; variant_id: string; quantity: number }) {
    const result = await this.productsService.checkAvailability(
      data.product_id,
      data.variant_id,
      data.quantity
    );
    
    return {
      available: result.available,
      available_quantity: result.available_quantity,
      message: result.message
    };
  }

  // Helper to map Prisma entity to Proto message format
  private mapToProto(product: any) {
    const mapped = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      base_price: Number(product.basePrice), // Decimal to number
      category_id: product.categoryId,
      is_active: product.isActive,
      created_at: product.createdAt.toISOString(),
      updated_at: product.updatedAt.toISOString(),
      variants: product.variants?.map((v: any) => ({
        id: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price_modifier: Number(v.priceModifier),
        stock_quantity: v.stockQuantity
      })) || [],
      image_urls: product.images?.sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((img: any) => img.url) || []
    };
    
    return mapped;
  }
}
