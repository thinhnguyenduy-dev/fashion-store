import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsUUID } from 'class-validator';

/**
 * DTO for updating an existing product
 * All fields are optional
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsUUID()
  id?: string;
}
