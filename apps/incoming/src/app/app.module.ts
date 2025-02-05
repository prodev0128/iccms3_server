import { config, AppInfo } from '@app/config';
import { LoggerModule } from '@app/logger';
import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppService } from './app.service';
import { DbRegisterModule } from '../modules/db-register/db-register.module';
import { EmailParserModule } from '../modules/email-parser/email-parser.module';
import { FileMoveModule } from '../modules/file-move/file-move.module';
import { FileWatcherModule } from '../modules/file-watcher/file-watcher.module';
import { TaskQueueModule } from '../modules/task-queue/task-queue.module';

@Module({})
export class AppModule {
  static forRoot(appInfo: AppInfo): DynamicModule {
    return {
      module: AppModule,
      imports: [
        LoggerModule.forRoot(`${config.incoming.name}-${appInfo.path}`),
        EventEmitterModule.forRoot(),
        TaskQueueModule,
        FileWatcherModule,
        FileMoveModule,
        EmailParserModule,
        DbRegisterModule,
      ],
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
