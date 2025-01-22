import { config } from '@app/config';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';

import { MailIncomingModule } from '../mail/mail-incoming.module';

const availableModules = config.env.subDirs
  .map((module: any) => {
    if (module.type === 'mail') {
      return MailIncomingModule.forRoot(module.path);
    } else if (module.type === 'ftp') {
      return MailIncomingModule.forRoot(module.path);
      // return FtpIncomingService.forRoot(module.path);
    } else if (module.type === 'outftp') {
      return MailIncomingModule.forRoot(module.path);
    }
    return null;
  })
  .filter((module: any) => module);

@Module({
  imports: [LoggerModule.forRoot(config.incoming.name), ...availableModules],
})
export class AppModule {}
