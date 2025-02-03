import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { FileWatcherService } from './file-watcher.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [FileWatcherService],
  exports: [FileWatcherService],
})
export class FileWatcherModule {}
