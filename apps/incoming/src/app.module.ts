import { config } from '@app/config';
import { LoggerModule } from '@app/logger';
import { DynamicModule, Module } from '@nestjs/common';

import { MailIncomingModule } from './modules/mail/mail-incoming.module';

@Module({})
export class AppModule {
  static forRoot(module: any): DynamicModule {
    return {
      module: AppModule,
      imports: [
        LoggerModule.forRoot(`${config.incoming.name}-${module.path}`),
        module.type === 'mail'
          ? MailIncomingModule.forRoot(module.path)
          : module.type === 'ftp'
            ? MailIncomingModule.forRoot(module.path)
            : MailIncomingModule.forRoot(module.path),
      ],
    };
  }
}
