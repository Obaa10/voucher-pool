import { registerAs } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export interface RateLimitConfig {
  throttler: ThrottlerModuleOptions;
}

export default registerAs('rateLimit', (): RateLimitConfig => ({
  throttler: {
    throttlers: [
      {
        ttl: parseInt(process.env.THROTTLER_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLER_LIMIT || '10', 10),
      }
    ]
  },
})); 