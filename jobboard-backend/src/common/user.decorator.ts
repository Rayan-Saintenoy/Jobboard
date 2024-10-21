import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const GetIdWithToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    const decodedToken = jwtService.decode(token) as any;

    return decodedToken ? decodedToken['id_user'] : null;
  },
);
