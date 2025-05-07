import { DynamicModule, Module } from '@nestjs/common';

import { AppInfo } from '@app/globals/config';

import { FileWatcherModule } from '../file-watcher/file-watcher.module';
import { MainWorkModule } from '../main-work/main-work.module';
import { TaskQueueModule } from '../task-queue/task-queue.module';
import { ProviderName } from '../types';
import { BotService } from './bot.service';

@Module({})
export class BotModule {
  static register(appInfo: AppInfo): DynamicModule {
    return {
      module: BotModule,
      imports: [FileWatcherModule, TaskQueueModule, MainWorkModule],
      providers: [
        {
          provide: ProviderName.APP_INFO,
          useValue: appInfo,
        },
        BotService,
      ],
      exports: [BotService],
    };
  }
}
