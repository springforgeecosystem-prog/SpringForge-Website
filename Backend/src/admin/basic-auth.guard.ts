import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const base64Credentials = authHeader.slice('Basic '.length).trim();
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const colonIndex = credentials.indexOf(':');

    if (colonIndex === -1) {
      throw new UnauthorizedException('Malformed credentials');
    }

    const username = credentials.substring(0, colonIndex);
    const password = credentials.substring(colonIndex + 1);

    const expectedUsername = process.env.ADMIN_USERNAME ?? 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD ?? 'changeme';

    if (username !== expectedUsername || password !== expectedPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return true;
  }
}
