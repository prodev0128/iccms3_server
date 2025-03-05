import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppInfo, config } from '@app/globals/config';
import { LoggerModule } from '@app/logger';

import { DbRegisterModule } from '../db-register/db-register.module';
import { EmailParserModule } from '../email-parser/email-parser.module';
import { FileMoveModule } from '../file-move/file-move.module';
import { FileWatcherModule } from '../file-watcher/file-watcher.module';
import { TaskQueueModule } from '../task-queue/task-queue.module';
import { AppService } from './app.service';

@Module({})
export class AppModule {
  static forRoot(appInfo: AppInfo): DynamicModule {
    return {
      imports: [
        LoggerModule.forRoot(`${config.incoming.name}-${appInfo.path}`),
        EventEmitterModule.forRoot(),
        TaskQueueModule,
        FileWatcherModule,
        FileMoveModule,
        EmailParserModule,
        DbRegisterModule,
      ],
      module: AppModule,
      providers: [
        {
          provide: 'APP_INFO',
          useValue: appInfo, // The connection string will be passed dynamically
        },
        AppService,
      ],
    };
  }
}
