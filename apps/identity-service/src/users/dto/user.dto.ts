import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  keycloakId: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
  
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateUserDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class FindUserDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
  
  @IsOptional()
  @IsString()
  keycloakId?: string;
}
