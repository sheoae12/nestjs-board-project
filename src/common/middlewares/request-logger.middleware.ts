import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.get('user-agent') || '';

    const query = JSON.stringify(req.query);

    const copiedBody = { ...req.body };
    if (copiedBody.password) {
      copiedBody.password = '*****';
    }
    const body = JSON.stringify(copiedBody);

    this.logger.log(
      `"${req.method} ${req.baseUrl}" ${query} ${body} - ${userAgent} ${req.ip}`,
    );

    next();
  }
}
