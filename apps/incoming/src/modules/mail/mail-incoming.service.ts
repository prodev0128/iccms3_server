import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { FileWatcherService } from '../file-watcher/file-watcher.service';

@Injectable()
export class MailIncomingService implements OnModuleInit {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('WATCH_DIRECTORY') private watchDirectory: string,
    private readonly fileWatcherService: FileWatcherService,
  ) {}

  // Watch Directory
  onModuleInit(): void {
    this.fileWatcherService.startWatching();
    const emitter = this.fileWatcherService.getEventEmitter();
    emitter.on('file.added', (path) => {
      this.logger.log(`File added: ${path}`);
    });
    emitter.on('file.changed', (path) => {
      this.logger.log(`File changed: ${path}`);
    });
    emitter.on('file.removed', (path) => {
      this.logger.log(`File removed: ${path}`);
    });
  }
}
