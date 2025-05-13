import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract user info from request
 * @example @GetUser() user: User
 * @example @GetUser('id') userId: string
 */
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (!data) {
      return request.user;
    }
    
    return request.user[data];
  },
); 