import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface RequesWithCookies extends Request {
  cookies: { [key: string]: string };
}

@Injectable()
export class AuthRedirectMiddleware implements NestMiddleware {
  use(req: RequesWithCookies, res: Response, next: NextFunction) {
    const token = req.cookies?.['auth-token'];
    if (!token) {
      res.cookie('redirect_to', req.originalUrl, { httpOnly: true });
    }
    next();
  }
}
