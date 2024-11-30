import { Injectable, NestMiddleware } from '@nestjs/common';
import * as rateLimit from 'express-rate-limit';
import * as RedisStore from 'rate-limit-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(private readonly redis: Redis) {}

  use() {
    return rateLimit({
      store: new RedisStore({
        client: this.redis,
        prefix: 'rate-limit:',
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    });
  }
}