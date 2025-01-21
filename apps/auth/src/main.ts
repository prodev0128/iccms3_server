import { config } from '@app/config';
import { setupLogger, setupSwagger } from '@app/utils';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';

async function bootstrap() {
  const logger = new Logger(config.auth.name);
  const app = await NestFactory.create(AuthModule);

  setupSwagger(app);
  setupLogger(app);

  const port = config.auth.port;
  await app.listen(port);
  logger.log(`🟢 Auth Module listening at ${port} 🟢`);
}

bootstrap();
