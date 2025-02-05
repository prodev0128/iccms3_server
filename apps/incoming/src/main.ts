import { config } from '@app/config';
import { NestFactory } from '@nestjs/core';
import { exec } from 'child_process';

import { AppModule } from './app/app.module';

async function bootstrap() {
  for (const appInfo of config.env.watchSubDirs) {
    const app = await NestFactory.createApplicationContext(AppModule.forRoot(appInfo));
    const logger = app.get('GLOBAL_LOGGER');
    logger.log(`🟢 Incoming-${appInfo.path} Module working at background 🟢`);
  }
}
bootstrap();
exec(`del logs\\${config.incoming.name}*.*`);
