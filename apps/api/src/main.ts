import { NestFactory } from '@nestjs/core';

import { config } from '@app/config';
import { setupLogger, setupSwagger } from '@app/utils';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get('GLOBAL_LOGGER');
  setupSwagger(app);
  setupLogger(app);

  const port = config.api.port;
  await app.listen(port);
  logger.log(`🟢 Api Module listening at ${port} 🟢`);
}

bootstrap();
