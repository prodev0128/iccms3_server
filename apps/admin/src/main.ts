import { NestFactory } from '@nestjs/core';
import { execSync } from 'child_process';

import { config } from '@app/config';
import { setupLogger, setupSwagger } from '@app/utils';

import { AppModule } from './app/app.module';

async function bootstrap() {
  execSync(`del logs\\${config.admin.name}*.*`);
  const app = await NestFactory.create(AppModule);

  const logger = app.get('GLOBAL_LOGGER');
  setupSwagger(app);
  setupLogger(app);

  const port = config.admin.port;
  await app.listen(port);
  logger.log(`🟢 Admin Module listening at ${port} 🟢`);
}

bootstrap();
