import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService, RegisterDto, LoginDto } from './auth.service';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

// Note: This controller exposes Auth methods via gRPC.
// The API Gateway calls these methods to handle auth.

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: any) {
    try {
      const dto: RegisterDto = {
        email: data.email,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
      };

      const result = await this.authService.register(dto);

      return {
        access_token: result.accessToken,
        expires_in: result.expiresIn,
        user: {
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.firstName,
          last_name: result.user.lastName,
        },
      };
    } catch (error: any) {
      if (error.status === 409) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: error.message,
        });
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || 'Registration failed',
      });
    }
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: any) {
    try {
      const dto: LoginDto = {
        email: data.email,
        password: data.password,
      };

      const result = await this.authService.login(dto);

      return {
        access_token: result.accessToken,
        expires_in: result.expiresIn,
        user: {
          id: result.user.id,
          email: result.user.email,
          first_name: result.user.firstName,
          last_name: result.user.lastName,
        },
      };
    } catch (error: any) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: error.message || 'Invalid credentials',
      });
    }
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: { token: string }) {
    try {
      const user = await this.authService.validateToken(data.token);

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
        },
      };
    } catch (error) {
      return {
        valid: false,
        user: null,
      };
    }
  }
}
