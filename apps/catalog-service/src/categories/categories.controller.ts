import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { GRPC_SERVICES } from '@fashion-store/proto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @GrpcMethod(GRPC_SERVICES.CATEGORY_SERVICE, 'Create')
  create(data: CreateCategoryDto) {
    const { parentId, ...rest } = data;
    // Map DTO to Prisma input
    // Using unchecked input style if supported by service, or mapping to relation
    return this.categoriesService.create({
      ...rest,
      parent: parentId ? { connect: { id: parentId } } : undefined,
    } as any);
  }

  @GrpcMethod(GRPC_SERVICES.CATEGORY_SERVICE, 'FindAll')
  async findAll() {
    const categories = await this.categoriesService.findAll();
    // Map dates to strings if necessary, though NestJS/gRPC might handle it.
    // Proto expects string for dates. Prisma returns Date objects.
    return { 
      categories: categories.map(cat => ({
        ...cat,
        created_at: cat.createdAt.toISOString(),
        updated_at: cat.updatedAt.toISOString(),
        parent_id: cat.parentId,
        image_url: cat.imageUrl,
        is_active: cat.isActive,
        sort_order: cat.sortOrder,
      })) 
    };
  }

  @GrpcMethod(GRPC_SERVICES.CATEGORY_SERVICE, 'FindOne')
  async findOne(data: { id: string }) {
    const cat = await this.categoriesService.findOne(data.id);
    if (!cat) return null;
    return {
      ...cat,
      created_at: cat.createdAt.toISOString(),
      updated_at: cat.updatedAt.toISOString(),
      parent_id: cat.parentId,
      image_url: cat.imageUrl,
      is_active: cat.isActive,
      sort_order: cat.sortOrder,
    };
  }

  @GrpcMethod(GRPC_SERVICES.CATEGORY_SERVICE, 'Update')
  async update(data: UpdateCategoryDto) {
    const { id, parentId, ...rest } = data;
    const updateData: any = { ...rest };
    if (parentId !== undefined) {
      updateData.parent = parentId ? { connect: { id: parentId } } : { disconnect: true };
    }
    
    const cat = await this.categoriesService.update(id, updateData);
    return {
      ...cat,
      created_at: cat.createdAt.toISOString(),
      updated_at: cat.updatedAt.toISOString(),
      parent_id: cat.parentId,
      image_url: cat.imageUrl,
      is_active: cat.isActive,
      sort_order: cat.sortOrder,
    };
  }

  @GrpcMethod(GRPC_SERVICES.CATEGORY_SERVICE, 'Delete')
  async remove(data: { id: string }) {
    await this.categoriesService.remove(data.id);
    return { success: true };
  }
}
