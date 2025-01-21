import { config } from '@app/config';
import { setupLogger, setupSwagger } from '@app/utils';
import { NestFactory } from '@nestjs/core';

import { AuthModule } from './modules/auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const logger = app.get('GLOBAL_LOGGER');
  setupSwagger(app);
  setupLogger(app);

  const port = config.auth.port;
  await app.listen(port);
  logger.log(`🟢 Auth Module listening at ${port} 🟢`);
}

bootstrap();
