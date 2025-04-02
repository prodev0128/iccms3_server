import { Module } from '@nestjs/common';

import { FileWatcherService } from './file-watcher.service';

@Module({
  exports: [FileWatcherService],
  providers: [FileWatcherService],
})
export class FileWatcherModule {}
