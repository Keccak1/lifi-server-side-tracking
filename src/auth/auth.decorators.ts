import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CLIENT_ID_COOKIE } from './constants';

export const ClientCookie = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.cookies[CLIENT_ID_COOKIE];
  },
);

export const SessionCookie = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.sessionData.session;
  },
);
