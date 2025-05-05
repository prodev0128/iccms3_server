import { DynamicModule, Module } from '@nestjs/common';

import { AppInfo } from '@app/globals/config';

import { ProviderName } from '../types';
import { FileWatcherService } from './file-watcher.service';

@Module({})
export class FileWatcherModule {
  static register(appInfo: AppInfo): DynamicModule {
    return {
      module: FileWatcherModule,
      providers: [{ provide: ProviderName.APP_INFO, useValue: appInfo }, FileWatcherService],
      exports: [FileWatcherService],
    };
  }
}
