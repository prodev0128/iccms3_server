import { NestFactory } from '@nestjs/core';
import { execSync } from 'child_process';

import { config } from '@app/globals/config';
import { SetupService } from '@app/setup';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const name = config.auth.name;
  execSync(`del logs\\${name}*.*`);

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const logger = app.get('GLOBAL_LOGGER');
  SetupService.setupSwagger(app);
  SetupService.setupApiLogger(app, logger);

  const port = config.auth.port;
  await app.listen(port);
  logger.log(`🟢 ${name} listening at ${port} 🟢`);
}

bootstrap();
