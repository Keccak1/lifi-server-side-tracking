import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);

  const requiredEnvVars = ['MONGO_URI', 'GA_MEASUREMENT_ID', 'GA_API_SECRET'];

  const unsetEnvVars = requiredEnvVars.filter(
    (envVar) => !(envVar in process.env),
  );

  if (unsetEnvVars.length > 0) {
    loggerService.error(
      `Required environment variables are not set: [${unsetEnvVars.join(', ')}]`,
    );
    process.exit(1);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');

  // TODO: This is only for test purposes
  app.enableCors({
    origin: function (origin, callback) {
      callback(null, true);
    },
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const port = process.env.APP_PORT || 3000;
  loggerService.log(`Listening on port ${port}`);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
