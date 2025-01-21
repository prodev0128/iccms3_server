import { DynamicModule, Module } from '@nestjs/common';

import { MailIncomingService } from './mail-incoming.service';
import { FileWatcherModule } from '../file-watcher/file-watcher.module';

@Module({})
export class MailIncomingModule {
  static forRoot(directory: string): DynamicModule {
    return {
      module: MailIncomingModule,
      imports: [FileWatcherModule.forRoot(directory)],
      providers: [
        {
          provide: 'WATCH_DIRECTORY',
          useValue: directory, // The connection string will be passed dynamically
        },
        MailIncomingService,
      ],
      exports: [MailIncomingService],
    };
  }
}
