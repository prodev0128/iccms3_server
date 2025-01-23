import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EmailParserService } from '../email-parser/email-parser.service';
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
    private readonly emailParseService: EmailParserService,
  ) {
    this.eventEmitter.on(`file.added.${this.instanceID}`, (filePath) => {
      this.logger.log('File Added:', filePath);
      this.handleFileAddedEvent(filePath);
    });
    this.eventEmitter.on(`file.changed.${this.instanceID}`, (filePath) => {
      this.logger.log('File Changed:', filePath);
      this.handleFileAddedEvent(filePath);
    });
    this.eventEmitter.on(`file.moved.${this.instanceID}`, (filePath) => {
      this.logger.log('File Moved:', filePath);
      this.handleFileMovedEvent(filePath);
    });
    this.eventEmitter.on(`email.parsed.${this.instanceID}`, (filePath) => {
      this.logger.log('Email Parsed:', filePath);
      this.handleFileMovedEvent(filePath);
    });
  }

  onModuleInit() {
    this.logger.log('File Watching:', this.instanceID);
    this.fileWatcherService.start(this.instanceID);
  }

  handleFileAddedEvent(filePath: string) {
    this.logger.log('File Moving:', filePath);
    this.fileMoveService.start(this.instanceID, filePath);
  }

  handleFileMovedEvent(filePath: string) {
    this.logger.log('Email Parsing:', filePath);
    this.emailParseService.start(this.instanceID, filePath);
  }
}
