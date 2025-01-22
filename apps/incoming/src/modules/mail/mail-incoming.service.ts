import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { FileMoveService } from '../file-move/file-move.service';
import { FileWatcherService } from '../file-watcher/file-watcher.service';

@Injectable()
export class MailIncomingService implements OnModuleInit {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('INSTANCE_ID') private readonly instanceID: string,
    private readonly eventEmitter: EventEmitter2,
    private readonly fileWatcherService: FileWatcherService,
    private readonly fileMoveService: FileMoveService,
  ) {}

  onModuleInit() {
    this.fileWatcherService.start(this.instanceID);
    this.eventEmitter.on(
      `file.added.${this.instanceID}`,
      (filePath, dirPath) => {
        this.logger.log('File Added:', filePath);
        this.handleFileAddedEvent(filePath, dirPath);
      },
    );
  }

  handleFileAddedEvent(filePath: string, dirPath: string) {
    this.fileMoveService.start(this.instanceID, filePath, dirPath);
    this.logger.log('File Moved:', filePath);
  }
}
