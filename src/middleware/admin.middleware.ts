import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { Role } from '../auth/dto/create-user.dto';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, _, next: NextFunction) {
    const { role } = req.body;
    if (role === Role.Admin) {
      console.log('Admin create request');
    }
    next();
  }
}
