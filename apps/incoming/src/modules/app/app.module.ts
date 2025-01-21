import { config } from '@app/config';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';

import { MailIncomingModule } from '../mail/mail-incoming.module';

@Module({
  imports: [
    LoggerModule.forRoot(config.incoming.name),
    ...config.incoming.watchDirectory.map((module: any) => {
      if (module.type === 'mail') {
        return MailIncomingModule.forRoot(module.path);
      } else if (module.type === 'ftp') {
        return MailIncomingModule.forRoot(module.path);
        // return FtpIncomingService.forRoot(module.path);
      }
      return MailIncomingModule.forRoot(module.path);
    }),
  ],
})
export class AppModule {}
