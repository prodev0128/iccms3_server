import { Module } from '@nestjs/common';

import { FtpIncomingController } from './ftp-incoming.controller';
import { FtpIncomingService } from './ftp-incoming.service';

@Module({
  imports: [],
  controllers: [FtpIncomingController],
  providers: [FtpIncomingService],
})
export class FtpIncomingModule {}
