import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';
import { GlobalsModule } from '@app/globals';
import { config } from '@app/globals/config';
import { LoggerModule } from '@app/logger';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, GlobalsModule, LoggerModule.forRoot(config.incoming.name)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
