import { SetMetadata } from '@nestjs/common';

/**
 * Available roles in the system
 */
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SELLER = 'seller',
  SUPPORT = 'support',
}

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for an endpoint
 * 
 * @example
 * ```typescript
 * @Roles(Role.ADMIN)
 * @Get('admin-only')
 * adminEndpoint() {
 *   return 'Admin only content';
 * }
 * 
 * @Roles(Role.ADMIN, Role.SELLER)
 * @Get('sellers')
 * sellersEndpoint() {
 *   return 'Sellers content';
 * }
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
