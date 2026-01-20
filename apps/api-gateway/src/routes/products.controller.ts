import { Controller, Get, Param, Query, Inject, OnModuleInit, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICES } from '@fashion-store/proto';
import { Observable } from 'rxjs';

interface ProductService {
  findAll(data: { page: number; limit: number; search?: string; category_id?: string }): Observable<any>;
  findOne(data: { id: string }): Observable<any>;
}

@Controller('products')
export class ProductsController implements OnModuleInit {
  private productService: ProductService;

  constructor(
    @Inject(GRPC_SERVICES.PRODUCT_SERVICE) private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>(GRPC_SERVICES.PRODUCT_SERVICE);
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
}
