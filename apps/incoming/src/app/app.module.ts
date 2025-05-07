import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { DatabaseModule } from '@app/database';
import { GlobalsModule } from '@app/globals';
import { config } from '@app/globals/config';
import { LoggerModule } from '@app/logger';

import { BotModule } from '../bot/bot.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    GlobalsModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      maxListeners: 10,
    }),
    LoggerModule.forRoot(config.incoming.name),
    ...config.env.watchSubDirs.map((dir) => BotModule.register(dir)),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
