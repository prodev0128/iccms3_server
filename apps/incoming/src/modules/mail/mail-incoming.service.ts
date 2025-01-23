import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EmailParserService } from '../email-parser/email-parser.service';
import { FileMoveService } from '../file-move/file-move.service';
import { FileWatcherService } from '../file-watcher/file-watcher.service';

@Injectable()
export class MailIncomingService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('INSTANCE_ID') private readonly instanceID: string,
    private readonly eventEmitter: EventEmitter2,
    private readonly fileWatcherService: FileWatcherService,
    private readonly fileMoveService: FileMoveService,
    private readonly emailParseService: EmailParserService,
  ) {}

  private readonly events = [
    {
      name: `file.added.${this.instanceID}`,
      handler: this.handleFileAddedEvent.bind(this),
    },
    {
      name: `file.changed.${this.instanceID}`,
      handler: this.handleFileAddedEvent.bind(this),
    },
    {
      name: `file.moved.${this.instanceID}`,
      handler: this.handleFileMovedEvent.bind(this),
    },
    {
      name: `email.parsed.${this.instanceID}`,
      handler: this.handleFileMovedEvent.bind(this),
    },
  ];

  onModuleInit() {
    this.registerEventListeners();
    this.logger.log('File Watching:', this.instanceID);
    this.fileWatcherService.start(this.instanceID);
  }

  onModuleDestroy() {
    this.unregisterEventListeners();
    this.fileWatcherService.stop(this.instanceID);
    this.logger.log(`Destroyed File Watching for: ${this.instanceID}`);
  }

  private registerEventListeners() {
    this.events.forEach(({ name, handler }) => {
      this.eventEmitter.on(name, handler);
    });
  }

  private unregisterEventListeners() {
    this.events.forEach(({ name }) =>
      this.eventEmitter.removeAllListeners(name),
    );
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
