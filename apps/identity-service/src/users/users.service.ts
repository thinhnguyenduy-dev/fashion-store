import { Injectable, Logger } from '@nestjs/common';
import { IdentityPrismaService } from '../prisma/identity-prisma.service';
import { CreateUserDto, UpdateUserDto, AddAddressDto, UpdateAddressDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: IdentityPrismaService) {}

  async create(data: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data,
      });
      this.logger.log(`Created user: ${user.id}`);
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') { // Unique constraint violation
        this.logger.warn(`User with email/keycloakId already exists`);
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'User already exists',
        });
      }
      this.logger.error('Failed to create user', error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to create user',
      });
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
    
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }
    
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { addresses: true },
    });
    
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'User not found',
      });
    }
    
    return user;
  }

  async update(data: UpdateUserDto) {
    const { id, ...updateData } = data;
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: { addresses: true },
      });
      return user;
    } catch (error) {
      this.logger.error(`Failed to update user ${id}`, error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to update user',
      });
    }
  }

  async addAddress(data: AddAddressDto) {
    try {
      if (data.isDefault) {
        // Unset other defaults if this one is default
        await this.prisma.address.updateMany({
          where: { userId: data.userId, type: data.type },
          data: { isDefault: false },
        });
      }

      const address = await this.prisma.address.create({
        data,
      });
      return address;
    } catch (error) {
      this.logger.error('Failed to add address', error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to add address',
      });
    }
  }

  async updateAddress(data: UpdateAddressDto) {
    const { id, userId, ...updateData } = data;
    try {
      if (updateData.isDefault) {
        // Fetch address to know type
        const addr = await this.prisma.address.findUnique({ where: { id } });
        if (addr) {
          await this.prisma.address.updateMany({
            where: { userId, type: addr.type, id: { not: id } },
            data: { isDefault: false },
          });
        }
      }

      const address = await this.prisma.address.update({
        where: { id },
        data: updateData,
      });
      return address;
    } catch (error) {
      this.logger.error('Failed to update address', error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to update address',
      });
    }
  }

  async deleteAddress(id: string, userId: string) {
    try {
      await this.prisma.address.delete({
        where: { id, userId },
      });
      return { success: true, message: 'Address deleted' };
    } catch (error) {
      this.logger.error('Failed to delete address', error);
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Failed to delete address',
      });
    }
  }
  
  async getAddresses(userId: string, type?: string) {
    const addresses = await this.prisma.address.findMany({
      where: { 
        userId,
        // @ts-expect-error - Prisma enum mapping
        type: type ? type : undefined 
      },
      orderBy: { isDefault: 'desc' },
    });
    return { addresses };
  }
}
