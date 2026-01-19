import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * User interface representing the authenticated user
 */
export interface AuthenticatedUser {
  id: string;
  keycloakId: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
}

/**
 * Decorator to extract the current authenticated user from the request
 * 
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthenticatedUser) {
 *   return user;
 * }
 * 
 * @Get('email')
 * getEmail(@CurrentUser('email') email: string) {
 *   return email;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
