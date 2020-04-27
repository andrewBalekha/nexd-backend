import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';

const getMinutes = (minutes: number) => minutes * 60 * 1000;

@Injectable()
export class DefaultRateLimitMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const defaultWindowMs = this.configService.get(
      'DEFAULT_RATE_LIMIT_MINUTES',
    );
    const defaultMaxRequests = this.configService.get(
      'DEFAULT_RATE_LIMIT_MAX_REQUESTS',
    );

    const config = {
      windowMs: getMinutes(defaultWindowMs || 15),
      max: defaultMaxRequests || 1000,
    };

    rateLimit(config)(req, res, next);
  }
}

@Injectable()
export class AuthRateLimitMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const defaultWindowMs = this.configService.get('AUTH_RATE_LIMIT_MINUTES');
    const defaultMaxRequests = this.configService.get(
      'AUTH_RATE_LIMIT_MAX_REQUESTS',
    );

    const config = {
      windowMs: getMinutes(defaultWindowMs || 30),
      max: defaultMaxRequests || 50,
    };

    rateLimit(config)(req, res, next);
  }
}
