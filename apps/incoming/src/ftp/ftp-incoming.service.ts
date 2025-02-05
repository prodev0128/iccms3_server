import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { DbRegisterService } from '../modules/db-register/db-register.service';
import { FileMoveService } from '../modules/file-move/file-move.service';
import { FileWatcherService } from '../modules/file-watcher/file-watcher.service';
import { TaskQueueService } from '../modules/task-queue/task-queue.service';

@Injectable()
export class FtpIncomingService implements OnModuleInit {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('INSTANCE_ID') private readonly instanceID: string,
    private readonly taskQueueService: TaskQueueService,
    private readonly fileWatcherService: FileWatcherService,
    private readonly fileMoveService: FileMoveService,
    private readonly dbRegisterService: DbRegisterService,
  ) {}

  onModuleInit() {
    this.logger.log(`Initializing file watcher`);
    this.fileWatcherService.start(this.instanceID);
  }

  @OnEvent('file.added')
  async handleFileAdded(filePath: string) {
    this.taskQueueService.addTask(filePath);
  }

  @OnEvent('task.added')
  async handleIncomingMail(task: any) {
    const res1 = await this.fileMoveService.start(this.instanceID, task.data);
    await this.dbRegisterService.start(this.instanceID, res1);
    this.taskQueueService.completeTask(task);
  }
}
