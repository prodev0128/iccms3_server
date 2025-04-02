import { NestFactory } from '@nestjs/core';
import { execSync } from 'child_process';

import { config } from '@app/globals/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const name = config.incoming.name;
  if (process.env.NODE_ENV === 'development') {
    execSync(`del logs\\${name}*.*`);
  }

  for (const appInfo of config.env.watchSubDirs) {
    const app = await NestFactory.createApplicationContext(AppModule.forRoot(appInfo));
    const logger = app.get('GLOBAL_LOGGER');
    logger.log(`🟢 ${name}-${appInfo.path} Module working at background 🟢`);
  }
}

bootstrap();
