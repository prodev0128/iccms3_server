import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';

import { MailIncomingService } from './mail-incoming.service';
import { EmailParserModule } from '../email-parser/email-parser.module';
import { FileMoveModule } from '../file-move/file-move.module';
import { FileWatcherModule } from '../file-watcher/file-watcher.module';

@Module({})
export class MailIncomingModule {
  static forRoot(directory: string): DynamicModule {
    return {
      module: MailIncomingModule,
      imports: [
        EventEmitterModule.forRoot(),
        MongooseModule,
        FileWatcherModule,
        FileMoveModule,
        EmailParserModule,
      ],
      providers: [
        {
          provide: 'INSTANCE_ID',
          useValue: directory, // The connection string will be passed dynamically
        },
        MailIncomingService,
      ],
      exports: [MailIncomingService],
    };
  }
}
