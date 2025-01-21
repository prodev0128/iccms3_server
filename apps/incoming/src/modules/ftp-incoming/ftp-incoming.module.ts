import { Module } from '@nestjs/common';

import { FtpIncomingService } from './ftp-incoming.service';
import { FileWatcherModule } from '../file-watcher/file-watcher.module';

@Module({
  imports: [FileWatcherModule],
  providers: [FtpIncomingService],
})
export class FtpIncomingModule {}
