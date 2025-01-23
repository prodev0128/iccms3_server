import { config } from '@app/config';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';

import { MailIncomingModule } from '../mail/mail-incoming.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot(config.incoming.name),
    MongooseModule,
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
