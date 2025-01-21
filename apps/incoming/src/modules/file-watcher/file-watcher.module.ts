import { DynamicModule, Module } from '@nestjs/common';

import { FileWatcherService } from './file-watcher.service';

@Module({})
export class FileWatcherModule {
  static forRoot(directory: string): DynamicModule {
    return {
      module: FileWatcherModule,
      imports: [],
      providers: [
        {
          provide: 'WATCH_DIRECTORY',
          useValue: directory, // The connection string will be passed dynamically
        },
        FileWatcherService,
      ],
      exports: [FileWatcherService],
    };
  }
}
