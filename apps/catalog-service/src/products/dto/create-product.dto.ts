import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsUUID, Min, MaxLength, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for creating a new product
 */
export class CreateProductDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(200)
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  basePrice: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsArray()
  images?: CreateProductImageDto[];

  @IsOptional()
  @IsArray()
  variants?: CreateProductVariantDto[];
}

/**
 * DTO for creating a product variant
 */
export class CreateProductVariantDto {
  @IsString()
  @MaxLength(50)
  sku: string;

  @IsString()
  @MaxLength(20)
  size: string;

  @IsString()
  @MaxLength(50)
  color: string;

  @IsOptional()
  @IsString()
  @MaxLength(7)
  colorHex?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  priceModifier?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;
}

/**
 * DTO for creating a product image
 */
export class CreateProductImageDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  altText?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
