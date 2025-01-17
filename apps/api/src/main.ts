import { config } from '@app/config';
import { setupLogger, setupSwagger } from '@app/utils';
import { NestFactory } from '@nestjs/core';

import { MainModule } from './modules';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  setupSwagger(app);
  setupLogger(app);

  const port = config.port.api;
  await app.listen(port);
  console.log(`🟢 Api Module listening at ${port} 🟢\n`);
}

bootstrap();
