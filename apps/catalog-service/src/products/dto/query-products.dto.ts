import { IsOptional, IsString, IsBoolean, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@fashion-store/shared-dto';

/**
 * DTO for querying products with filters
 */
export class QueryProductsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsIn(['name', 'basePrice', 'createdAt', 'updatedAt'])
  override sortBy?: string = 'createdAt';
}
