import { NestFactory } from '@nestjs/core';

import { config } from '@app/globals/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  for (const appInfo of config.env.watchSubDirs) {
    const app = await NestFactory.createApplicationContext(AppModule.forRoot(appInfo));
    const logger = app.get('GLOBAL_LOGGER');
    logger.log(`🟢 ${config.incoming.name}-${appInfo.path} Module working at background 🟢`);
  }
}

bootstrap();
