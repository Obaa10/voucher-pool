import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
  ormConfig: TypeOrmModuleOptions;
}

export default registerAs('database', (): DatabaseConfig => ({
  ormConfig: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'voucher_pool_dev',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [`${__dirname}/migration/*.js`],
    synchronize: true,
    migrationsRun: true,
    autoLoadEntities: true,
    legacySpatialSupport: false,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
})); 