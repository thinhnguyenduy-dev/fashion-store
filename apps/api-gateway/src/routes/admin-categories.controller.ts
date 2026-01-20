import { Controller, Get, Post, Put, Delete, Body, Param, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICES } from '@fashion-store/proto';
import { Observable } from 'rxjs';

interface CategoryService {
  create(data: any): Observable<any>;
  findAll(data: {}): Observable<any>;
  findOne(data: { id: string }): Observable<any>;
  update(data: any): Observable<any>;
  delete(data: { id: string }): Observable<any>;
}

@Controller('admin/categories')
export class AdminCategoriesController implements OnModuleInit {
  private categoryService: CategoryService;

  constructor(
    @Inject(GRPC_SERVICES.CATEGORY_SERVICE) private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.categoryService = this.client.getService<CategoryService>(GRPC_SERVICES.CATEGORY_SERVICE);
  }

  @Post()
  create(@Body() data: any) {
    return this.categoryService.create(data);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne({ id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.categoryService.update({ id, ...data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.delete({ id });
  }
}
