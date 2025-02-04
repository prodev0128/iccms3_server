import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { DbRegisterService } from '../db-register/db-register.service';
import { EmailParserService } from '../email-parser/email-parser.service';
import { FileMoveService } from '../file-move/file-move.service';
import { FileWatcherService } from '../file-watcher/file-watcher.service';
import { TaskQueueService } from '../task-queue/task-queue.service';

@Injectable()
export class MailIncomingService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('INSTANCE_ID') private readonly instanceID: string,
    private readonly taskQueueService: TaskQueueService,
    private readonly fileWatcherService: FileWatcherService,
    private readonly fileMoveService: FileMoveService,
    private readonly emailParseService: EmailParserService,
    private readonly dbRegisterService: DbRegisterService,
  ) {}

  onModuleInit() {
    this.logger.log(`Initializing file watcher`);
    this.fileWatcherService.start(this.instanceID);
  }

  onModuleDestroy() {
    this.fileWatcherService.stop();
    this.logger.log(`Cleaning up resources`);
  }

  @OnEvent('file.added')
  async handleFileAdded(filePath: string) {
    this.taskQueueService.addTask(filePath);
  }

  @OnEvent('task.added')
  async handleIncomingMail(tasks: any) {
    this.logger.log('------------', tasks.length);
    for (const task of tasks) {
      await this.fileMoveService.start(this.instanceID, task.data);
      this.taskQueueService.completeTask(task);
    }
  }
}
