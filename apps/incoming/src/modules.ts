import { Module } from '@nestjs/common';

import { FtpIncomingModule } from './modules/ftp-incoming/ftp-incoming.module';

@Module({
  imports: [FtpIncomingModule],
})
export class MainModule {}
