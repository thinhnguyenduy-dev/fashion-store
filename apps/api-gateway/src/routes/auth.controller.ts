import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICES, GRPC_PACKAGES } from '@fashion-store/proto';
import { Observable } from 'rxjs';

interface UserService {
  create(data: any): Observable<any>;
  findByEmail(data: { email: string }): Observable<any>;
  findOne(data: { id: string }): Observable<any>;
}

@Controller('auth')
export class AuthController implements OnModuleInit {
  private userService: UserService;

  constructor(
    @Inject(GRPC_SERVICES.USER_SERVICE) private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>(GRPC_SERVICES.USER_SERVICE);
  }

  @Post('register')
  async register(@Body() body: any) {
    // In a real scenario, we would register with Keycloak first
    // For this demo, we just create the user in our DB via Identity Service
    // The body should contain { email, password, firstName, lastName, ... }
    
    // Stub: Simulate Keycloak ID generation
    const keycloakId = `kc-${Date.now()}`;
    
    return this.userService.create({
      keycloak_id: keycloakId,
      email: body.email,
      first_name: body.firstName,
      last_name: body.lastName,
      phone: body.phone,
    });
  }

  @Post('login')
  async login(@Body() body: any) {
    // In a real scenario, this would proxy the request to Keycloak's token endpoint
    // and return the JWT access token.
    return {
      message: 'This is a stub login endpoint. Integrate Keycloak for real tokens.',
      stub_token: 'valid-jwt-token-placeholder',
      user: await this.userService.findByEmail({ email: body.email }).toPromise().catch(() => null)
    };
  }
}
