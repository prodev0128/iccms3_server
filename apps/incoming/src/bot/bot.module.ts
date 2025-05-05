import { DynamicModule, Module, Scope } from '@nestjs/common';

import { AppInfo } from '@app/globals/config';

import { FileWatcherModule } from '../file-watcher/file-watcher.module';
import { TaskQueueModule } from '../task-queue/task-queue.module';
import { ProviderName } from '../types';
import { WorkModule } from '../work/work.module';
import { BotService } from './bot.service';

@Module({})
export class BotModule {
  static register(appInfo: AppInfo): DynamicModule {
    const appInfoToken = `Incoming_${appInfo.path}_bot`;

    return {
      module: BotModule,
      imports: [FileWatcherModule, TaskQueueModule, WorkModule],
      providers: [
        {
          provide: appInfoToken,
          useValue: appInfo,
        },
        {
          provide: ProviderName.APP_INFO,
          useExisting: appInfoToken,
        },
        {
          provide: BotService,
          useClass: BotService,
          scope: Scope.TRANSIENT, // ✅ THIS IS CRUCIAL
        },
      ],
      exports: [BotService],
    };
  }
}
