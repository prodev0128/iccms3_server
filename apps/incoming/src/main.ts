import { NestFactory } from '@nestjs/core';
import { execSync } from 'child_process';

import { config } from '@app/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  execSync(`del logs\\${config.incoming.name}*.*`);

  for (const appInfo of config.env.watchSubDirs) {
    const app = await NestFactory.createApplicationContext(AppModule.forRoot(appInfo));
    const logger = app.get('GLOBAL_LOGGER');
    logger.log(`🟢 Incoming-${appInfo.path} Module working at background 🟢`);
  }
}

bootstrap();
