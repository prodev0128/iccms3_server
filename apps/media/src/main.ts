import { NestFactory } from '@nestjs/core';

import { config } from '@app/globals/config';
import { SetupService } from '@app/setup';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const logger = app.get('GLOBAL_LOGGER');
  SetupService.setupSwagger(app);
  SetupService.setupApiLogger(app, logger);

  const port = config.media.port;
  await app.listen(port);
  logger.log(`🟢 ${config.media.name} listening at ${port} 🟢`);
}

bootstrap();
