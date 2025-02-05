import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { FtpIncomingService } from './ftp-incoming.service';
import { DbRegisterModule } from '../modules/db-register/db-register.module';
import { EmailParserModule } from '../modules/email-parser/email-parser.module';
import { FileMoveModule } from '../modules/file-move/file-move.module';
import { FileWatcherModule } from '../modules/file-watcher/file-watcher.module';
import { TaskQueueModule } from '../modules/task-queue/task-queue.module';

@Module({})
export class FtpIncomingModule {
  static forRoot(directory: string): DynamicModule {
    return {
      module: FtpIncomingModule,
      imports: [
        EventEmitterModule.forRoot(),
        TaskQueueModule,
        FileWatcherModule,
        FileMoveModule,
        EmailParserModule,
        DbRegisterModule,
      ],
      providers: [
        {
          provide: 'INSTANCE_ID',
          useValue: directory, // The connection string will be passed dynamically
        },
        FtpIncomingService,
      ],
      exports: [FtpIncomingService],
    };
  }
}
