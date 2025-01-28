import { DynamicModule, Module } from '@nestjs/common';

import { MailIncomingService } from './mail-incoming.service';
import { DbRegisterModule } from '../db-register/db-register.module';
import { EmailParserModule } from '../email-parser/email-parser.module';
import { FileMoveModule } from '../file-move/file-move.module';
import { FileWatcherModule } from '../file-watcher/file-watcher.module';

@Module({})
export class MailIncomingModule {
  static forRoot(directory: string): DynamicModule {
    return {
      module: MailIncomingModule,
      imports: [
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
        MailIncomingService,
      ],
      exports: [MailIncomingService],
    };
  }
}
