import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';
  const port = configService.get<number>('PORT') || 3000;

  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    })
  );


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: isProduction,
    })
  );

  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.enableCors({
    origin: isProduction
      ? ['https://your-production-domain.com']
      : ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix(configService.get('API_PREFIX'));

  // Application Lifecycle Hooks
  app.enableShutdownHooks();


  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${configService.get('NODE_ENV')}`);
    console.log(`API Documentation: http://localhost:${port}/docs`);
  });
}

bootstrap().catch((err) => {
  console.error('Application failed to start:', err);
  process.exit(1);
});
