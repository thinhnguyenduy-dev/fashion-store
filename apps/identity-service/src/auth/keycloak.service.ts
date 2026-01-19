import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);
  private readonly keycloakUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.keycloakUrl = this.configService.get<string>('KEYCLOAK_URL', 'http://localhost:8080');
    this.realm = this.configService.get<string>('KEYCLOAK_REALM', 'fashion-store');
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID', 'api-gateway');
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CLIENT_SECRET', '');
  }

  async login(username: string, password: string): Promise<any> {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || data.error || 'Login failed');
      }

      return data; // returns access_token, refresh_token, etc.
    } catch (error: any) {
      this.logger.error('Keycloak login failed', error.message);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || data.error || 'Refresh token failed');
      }

      return data;
    } catch (error: any) {
      this.logger.error('Keycloak refresh token failed', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  
  // Note: Registration typically involves creating a user in Keycloak via Admin API.
  // For simplicity solely for this demo, we might rely on client-side registration redirection 
  // or implement admin client usage here. That's more complex.
  // For now, let's assume we implement the 'password' grant flow logic. 
  // Proper Admin API client integration is needed for backend registration.
  
  async registerUserInKeycloak(userData: any): Promise<string> {
      // Stub: in production, use @keycloak/keycloak-admin-client
      // to create user, set password, and assign roles.
      // For now, we'll return a fake ID to simulate success if Keycloak isn't fully set up for admin ops
      this.logger.warn('Register in Keycloak is a STUB. Implement with Admin Client.');
      return `keycloak-id-${Date.now()}`;
  }
}
