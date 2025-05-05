import { DynamicModule, Module } from '@nestjs/common';

import { AppInfo } from '@app/globals/config';

import { ProviderName } from '../types';
import { TaskQueueService } from './task-queue.service';

@Module({})
export class TaskQueueModule {
  static register(appInfo: AppInfo): DynamicModule {
    return {
      module: TaskQueueModule,
      providers: [{ provide: ProviderName.APP_INFO, useValue: appInfo }, TaskQueueService],
      exports: [TaskQueueService],
    };
  }
}
