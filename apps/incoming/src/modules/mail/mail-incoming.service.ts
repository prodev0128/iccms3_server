import { Process } from '@nestjs/bull';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DbRegisterService } from '../db-register/db-register.service';
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
    private readonly dbRegisterService: DbRegisterService,
  ) {}

  onModuleInit() {
    this.eventEmitter.on(`file.added.${this.instanceID}`, (filePath) => {
      this.handleFileAddedEvent(filePath);
    });
    this.logger.log(
      `Initializing file watcher for instance: ${this.instanceID}`,
    );
    this.fileWatcherService.start(this.instanceID);
  }

  onModuleDestroy() {
    this.eventEmitter.removeAllListeners(`file.added.${this.instanceID}`);
    this.fileWatcherService.stop(this.instanceID);
    this.logger.log(`Cleaning up resources for instance: ${this.instanceID}`);
  }

  @Process('TASK')
  handleFileAddedEvent(filePath: string) {
    this.logger.log(`New file detected: ${filePath}. Initiating file move.`);
    this.fileMoveService.start(this.instanceID, filePath);
  }

  handleFileMovedEvent(filePath: string) {
    this.logger.log(`File moved: ${filePath}. Starting email parsing.`);
    this.emailParseService.start(this.instanceID, filePath);
  }

  async handleEmailParsedEvent(filePaths: string[]) {
    this.logger.log(`Email parsed: ${filePaths}. Starting db registering.`);
    for (const filePath of filePaths) {
      await this.dbRegisterService.start(this.instanceID, filePath);
    }
  }

  handleDbRegisteredEvent(filePath: string) {
    this.logger.log(`Db registered: ${filePath}. Starting file checking.`);
    // this.emailParseService.start(this.instanceID, filePath);
  }
}
