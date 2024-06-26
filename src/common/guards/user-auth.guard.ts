import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const excludeGuard = this.reflector.get<boolean>(
      'exclude',
      context.getHandler(),
    );
    if (excludeGuard) return true;

    const { authorization } = request.headers;

    if (authorization === undefined) {
      throw new UnauthorizedException(
        'Unauthorized:: no authorization headers',
      );
    }

    const token = authorization.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Unauthorized:: no token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.user = payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Unauthorized:: invalid token');
    }
    return true;
  }
}
