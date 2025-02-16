import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DATABASE_SSL: Joi.boolean().default(false),
  THROTTLER_TTL: Joi.number().default(60),
  THROTTLER_LIMIT: Joi.number().default(10),
}); 
