import { Controller, Post, Body, Get, Headers, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICES } from '@fashion-store/proto';
import { Observable, firstValueFrom } from 'rxjs';

interface AuthService {
  register(data: any): Observable<any>;
  login(data: any): Observable<any>;
  validateToken(data: { token: string }): Observable<any>;
}

interface UserService {
  create(data: any): Observable<any>;
  findByEmail(data: { email: string }): Observable<any>;
  findOne(data: { id: string }): Observable<any>;
}

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthService;
  private userService: UserService;

  constructor(
    @Inject(GRPC_SERVICES.AUTH_SERVICE) private authClient: ClientGrpc,
    @Inject(GRPC_SERVICES.USER_SERVICE) private userClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.authClient.getService<AuthService>(GRPC_SERVICES.AUTH_SERVICE);
    this.userService = this.userClient.getService<UserService>(GRPC_SERVICES.USER_SERVICE);
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; firstName?: string; lastName?: string; phone?: string }) {
    try {
      const result = await firstValueFrom(
        this.authService.register({
          email: body.email,
          password: body.password,
          first_name: body.firstName,
          last_name: body.lastName,
          phone: body.phone,
        })
      );

      return {
        success: true,
        accessToken: result.access_token,
        expiresIn: result.expires_in,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.first_name,
          lastName: result.user.last_name,
        },
      };
    } catch (error: any) {
      const message = error?.details || error?.message || 'Registration failed';
      throw new UnauthorizedException(message);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    try {
      const result = await firstValueFrom(
        this.authService.login({
          email: body.email,
          password: body.password,
        })
      );

      return {
        success: true,
        accessToken: result.access_token,
        expiresIn: result.expires_in,
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.first_name,
          lastName: result.user.last_name,
        },
      };
    } catch (error: any) {
      const message = error?.details || error?.message || 'Invalid credentials';
      throw new UnauthorizedException(message);
    }
  }

  @Get('me')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const result = await firstValueFrom(
        this.authService.validateToken({ token })
      );

      if (!result.valid) {
        throw new UnauthorizedException('Invalid token');
      }

      return {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
      };
    } catch (error: any) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
