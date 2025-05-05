import { Module } from '@nestjs/common';

import { FileWatcherService } from './file-watcher.service';

@Module({
  providers: [FileWatcherService],
  exports: [FileWatcherService],
})
export class FileWatcherModule {}
