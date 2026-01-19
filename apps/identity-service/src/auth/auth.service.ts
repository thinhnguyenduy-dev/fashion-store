import { Injectable, Logger, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { IdentityPrismaService } from '../prisma/identity-prisma.service';

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 10;

  constructor(
    private readonly prisma: IdentityPrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResponse> {
    this.logger.log(`Registering user: ${data.email}`);

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, this.saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });

    this.logger.log(`User registered: ${user.id}`);

    // Generate tokens
    return this.generateAuthResponse(user);
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    this.logger.log(`Login attempt for: ${data.email}`);

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('This account uses social login');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    this.logger.log(`User logged in: ${user.id}`);

    return this.generateAuthResponse(user);
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid token');
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateAuthResponse(user: any): AuthResponse {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const expiresIn = 3600; // 1 hour

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${expiresIn}s`,
    });

    return {
      accessToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
