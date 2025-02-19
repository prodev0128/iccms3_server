import { NestFactory } from '@nestjs/core';
import { execSync } from 'child_process';

import { config } from '@app/config';
import { SetupService } from '@app/setup';

import { AppModule } from './app/app.module';

async function bootstrap() {
  execSync(`del logs\\${config.api.name}*.*`);
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const logger = app.get('GLOBAL_LOGGER');
  SetupService.setupSwagger(app);
  SetupService.setupApiLogger(app, logger);

  const port = config.api.port;
  await app.listen(port);
  logger.log(`🟢 Api Module listening at ${port} 🟢`);
}

bootstrap();
