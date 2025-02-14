import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    console.log(`[Request] ${method} ${originalUrl}`);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      console.log(`[Response] ${method} ${originalUrl} ${statusCode} ${duration}ms`);
    });

    next();
  }
}
