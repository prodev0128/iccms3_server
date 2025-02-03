import { config } from '@app/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  for (const module of config.env.watchSubDirs) {
    const app = await NestFactory.createApplicationContext(
      AppModule.forRoot(module),
    );
    const logger = app.get('GLOBAL_LOGGER');
    logger.log(`🟢 Incoming-${module.path} Module working at background 🟢`);
  }
}
bootstrap();
