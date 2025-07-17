import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserEnum } from '../enum/user.enum';
import { RequestWithUser } from './jwt.interface';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserEnum[]) => SetMetadata(ROLES_KEY, roles);

export const GetUser = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return key ? user?.[key] : user;
  },
);
