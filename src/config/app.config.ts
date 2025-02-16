import { registerAs } from '@nestjs/config';

export interface AppConfig {
  environment: string;
  port: number;
  apiPrefix: string;
}

export default registerAs('app', (): AppConfig => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
})); 