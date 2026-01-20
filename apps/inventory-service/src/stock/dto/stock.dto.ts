import { IsString, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class StockItemDto {
  @IsString()
  productId: string;

  @IsString()
  variantId: string;

  @IsString()
  sku: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ReserveStockDto {
  @IsString()
  orderId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockItemDto)
  items: StockItemDto[];
}

export class ReleaseStockDto {
  @IsString()
  orderId: string;

  @IsString()
  reservationId: string;
}
