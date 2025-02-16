import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import { SeedModule } from './seeds/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfig().ormConfig,
      inject: [ConfigService],
    }),
    SeedModule,
  ],
  exports: [TypeOrmModule, SeedModule],
})
export class DatabaseModule {} 