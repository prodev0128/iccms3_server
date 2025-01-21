import { config } from '@app/config';
import { setupLogger, setupSwagger } from '@app/utils';
import { NestFactory } from '@nestjs/core';

import { MainModule } from './modules';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const logger = app.get('GLOBAL_LOGGER');
  setupSwagger(app);
  setupLogger(app);

  const port = config.admin.port;
  await app.listen(port);
  logger.log(`🟢 Api Module listening at ${port} 🟢`);
}

bootstrap();
