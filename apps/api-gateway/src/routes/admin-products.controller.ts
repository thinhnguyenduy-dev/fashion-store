import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, OnModuleInit, ParseIntPipe, DefaultValuePipe, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICES } from '@fashion-store/proto';
import { Observable } from 'rxjs';

interface ProductService {
  create(data: any): Observable<any>;
  findAll(data: { page: number; limit: number; search?: string; category_id?: string }): Observable<any>;
  findOne(data: { id: string }): Observable<any>;
  update(data: any): Observable<any>;
  delete(data: { id: string }): Observable<any>;
  checkAvailability(data: { product_id: string; variant_id: string; quantity: number }): Observable<any>;
}

@Controller('admin/products')
export class AdminProductsController implements OnModuleInit {
  private productService: ProductService;

  constructor(
    @Inject(GRPC_SERVICES.PRODUCT_SERVICE) private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>(GRPC_SERVICES.PRODUCT_SERVICE);
  }

  @Post()
  create(@Body() data: any) {
    return this.productService.create(data);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('category') category_id?: string,
  ) {
    return this.productService.findAll({ page, limit, search, category_id });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne({ id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.productService.update({ id, ...data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.delete({ id });
  }
}
