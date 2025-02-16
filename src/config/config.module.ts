import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { envValidationSchema } from './env.schema';
import databaseConfig from './database.config';
import appConfig from './app.config';
import rateLimitConfig from './rate-limit.config';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            validationSchema: envValidationSchema,
            load: [appConfig, databaseConfig, rateLimitConfig],
        }),
        TypeOrmModule.forRoot(databaseConfig().ormConfig),
        ThrottlerModule.forRoot(rateLimitConfig().throttler),
    ],
})
export class ConfigModule { }