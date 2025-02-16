import { Module } from '@nestjs/common';
import { DatabaseModule } from './database';
import * as models from './modules';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ...Object.values(models),
  ],
})
export class AppModule { }
