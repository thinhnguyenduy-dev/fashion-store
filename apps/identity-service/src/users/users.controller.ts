import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AddAddressDto, UpdateAddressDto } from './dto';
import { GRPC_SERVICES } from '@fashion-store/proto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod(GRPC_SERVICES.USER_SERVICE, 'Create')
  async create(data: any) {
    // Map proto headers
    const dto: CreateUserDto = {
        keycloakId: data.keycloak_id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
    };
    const user = await this.usersService.create(dto);
    return this.mapUserToProto(user);
  }

  @GrpcMethod(GRPC_SERVICES.USER_SERVICE, 'FindOne')
  async findOne(data: { id: string }) {
    const user = await this.usersService.findOne(data.id);
    return this.mapUserToProto(user);
  }

  @GrpcMethod(GRPC_SERVICES.USER_SERVICE, 'FindByEmail')
  async findByEmail(data: { email: string }) {
    const user = await this.usersService.findByEmail(data.email);
    return this.mapUserToProto(user);
  }

  @GrpcMethod(GRPC_SERVICES.USER_SERVICE, 'Update')
  async update(data: any) {
    const dto: UpdateUserDto = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        avatarUrl: data.avatar_url
    };
    const user = await this.usersService.update(dto);
    return this.mapUserToProto(user);
  }

  @GrpcMethod(GRPC_SERVICES.USER_SERVICE, 'AddAddress')
  async addAddress(data: any) {
    const dto: AddAddressDto = {
        userId: data.user_id,
        // @ts-ignore
        type: data.type,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
        isDefault: data.is_default
    };
    const address = await this.usersService.addAddress(dto);
    return this.mapAddressToProto(address);
  }

  @GrpcMethod(GRPC_SERVICES.USER_SERVICE, 'UpdateAddress')
  async updateAddress(data: any) {
    const dto: UpdateAddressDto = {
        id: data.id,
        userId: data.user_id,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postal_code,
        country: data.country,
        isDefault: data.is_default
    };
    const address = await this.usersService.updateAddress(dto);
    return this.mapAddressToProto(address);
  }

  @GrpcMethod(GRPC_SERVICES.USER_SERVICE, 'DeleteAddress')
  async deleteAddress(data: { id: string; user_id: string }) {
    return this.usersService.deleteAddress(data.id, data.user_id);
  }

  @GrpcMethod(GRPC_SERVICES.USER_SERVICE, 'GetAddresses')
  async getAddresses(data: { user_id: string; type?: string }) {
    const result = await this.usersService.getAddresses(data.user_id, data.type);
    return {
        addresses: result.addresses.map(a => this.mapAddressToProto(a))
    };
  }

  private mapUserToProto(user: any) {
    return {
      id: user.id,
      keycloak_id: user.keycloakId,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      avatar_url: user.avatarUrl,
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }

  private mapAddressToProto(addr: any) {
    return {
      id: addr.id,
      user_id: addr.userId,
      type: addr.type,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postalCode,
      country: addr.country,
      is_default: addr.isDefault,
      created_at: addr.createdAt.toISOString(),
      updated_at: addr.updatedAt.toISOString(),
    };
  }
}
