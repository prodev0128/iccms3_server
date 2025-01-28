import { config } from '@app/config';
import { DatabaseModule } from '@app/database';
import { LoggerModule } from '@app/logger';
import { ExpressAdapter } from '@bull-board/express';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { FileWatcherModule } from '../file-watcher/file-watcher.module';
import { MailIncomingModule } from '../mail/mail-incoming.module';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot(config.incoming.name),
    DatabaseModule,
    FileWatcherModule,
    ...config.env.subDirs
      .map((module: any) => {
        if (module.type === 'mail') {
          return MailIncomingModule.forRoot(module.path);
        } else if (module.type === 'ftp') {
          return MailIncomingModule.forRoot(module.path);
        } else if (module.type === 'outftp') {
          return MailIncomingModule.forRoot(module.path);
        }
        return null;
      })
      .filter((module: any) => module),
  ],
})
export class AppModule {}
