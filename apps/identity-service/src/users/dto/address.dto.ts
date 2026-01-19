import { IsString, IsEnum, IsBoolean, IsOptional, IsUUID } from 'class-validator';

export enum AddressType {
  SHIPPING = 'SHIPPING',
  BILLING = 'BILLING',
}

export class AddAddressDto {
  @IsUUID()
  userId: string;

  @IsEnum(AddressType)
  type: AddressType;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  postalCode: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
