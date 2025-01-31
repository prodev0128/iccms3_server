import { InjectQueue, Process, Processor } from '@nestjs/bull';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';

import { DbRegisterService } from '../db-register/db-register.service';
import { EmailParserService } from '../email-parser/email-parser.service';
import { FileMoveService } from '../file-move/file-move.service';
import { FileWatcherService } from '../file-watcher/file-watcher.service';

@Injectable()
@Processor('TASK_QUEUE')
export class MailIncomingService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('INSTANCE_ID') private readonly instanceID: string,
    @InjectQueue('TASK_QUEUE') private readonly taskQueue: Queue,
    private readonly eventEmitter: EventEmitter2,
    private readonly fileWatcherService: FileWatcherService,
    private readonly fileMoveService: FileMoveService,
    private readonly emailParseService: EmailParserService,
    private readonly dbRegisterService: DbRegisterService,
  ) {}

  onModuleInit() {
    this.eventEmitter.on(`file.added.${this.instanceID}`, (filePath) => {
      this.taskQueue.add(filePath);
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
  async handleFileAddedEvent(filePath: string) {
    this.logger.log(`New file detected: ${filePath}. Initiating file move.`);
    const destPath = await this.fileMoveService.start(
      this.instanceID,
      filePath,
    );
    const emailPaths = await this.emailParseService.start(
      this.instanceID,
      destPath,
    );
    for (const emailPath of emailPaths) {
      await this.dbRegisterService.start(this.instanceID, emailPath);
    }
  }
}
