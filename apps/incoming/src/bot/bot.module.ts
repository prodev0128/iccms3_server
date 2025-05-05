import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AppInfo } from '@app/globals/config';

import { FileWatcherModule } from '../file-watcher/file-watcher.module';
import { FileWatcherService } from '../file-watcher/file-watcher.service';
import { TaskQueueModule } from '../task-queue/task-queue.module';
import { TaskQueueService } from '../task-queue/task-queue.service';
import { ProviderName } from '../types';
import { WorkModule } from '../work/work.module';
import { BotService } from './bot.service';

@Module({})
export class BotModule {
  static register(appInfo: AppInfo): DynamicModule {
    const CONFIG_TOKEN = `BOT_CONFIG_${appInfo.path}`;
    const EMITTER_TOKEN = `EVENT_EMITTER_${appInfo.path}`;

    return {
      module: BotModule,
      imports: [FileWatcherModule.register(appInfo), TaskQueueModule.register(appInfo), WorkModule],
      providers: [
        {
          provide: ProviderName.APP_INFO,
          useValue: appInfo,
        },
        {
          provide: BotService,
          useFactory: (cfg, fileWatcher: FileWatcherService, taskQueue: TaskQueueService, emitter: EventEmitter2) =>
            new BotService(cfg, fileWatcher, taskQueue, emitter),
          inject: [CONFIG_TOKEN, FileWatcherService, TaskQueueService, EMITTER_TOKEN],
        },
      ],
      exports: [BotService],
    };
  }
}
