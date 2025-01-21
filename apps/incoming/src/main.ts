import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule);
  const logger = app.get('GLOBAL_LOGGER');
  await app.listen();
  logger.log(`🟢 Incoming Module working at background 🟢`);
}
bootstrap();
