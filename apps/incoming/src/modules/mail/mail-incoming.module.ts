import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MailIncomingService } from './mail-incoming.service';
import { DbRegisterModule } from '../db-register/db-register.module';
import { EmailParserModule } from '../email-parser/email-parser.module';
import { FileMoveModule } from '../file-move/file-move.module';
import { FileWatcherModule } from '../file-watcher/file-watcher.module';
import { TaskQueueModule } from '../task-queue/task-queue.module';

@Module({})
export class MailIncomingModule {
  static forRoot(directory: string): DynamicModule {
    const eventEmitter = new EventEmitter2(); // Create independent emitter

    return {
      module: MailIncomingModule,
      imports: [
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
        {
          provide: EventEmitter2,
          useValue: eventEmitter, // Provide scoped EventEmitter
        },
        MailIncomingService,
      ],
      exports: [MailIncomingService],
    };
  }
}
