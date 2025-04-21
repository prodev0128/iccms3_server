import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';
import { GlobalsModule } from '@app/globals';
import { config } from '@app/globals/config';
import { LoggerModule } from '@app/logger';

import { BotModule } from '../bot/bot.module';
import { TaskQueueModule } from '../task-queue/task-queue.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, GlobalsModule, TaskQueueModule, LoggerModule.forRoot(config.incoming.name), BotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
