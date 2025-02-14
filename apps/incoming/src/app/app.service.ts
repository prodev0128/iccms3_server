import { Logger, OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AppInfo } from '@app/config';

import { DbRegisterService } from '../modules/db-register/db-register.service';
import { FileMoveService } from '../modules/file-move/file-move.service';
import { FileWatcherService } from '../modules/file-watcher/file-watcher.service';
import { Task, TaskQueueService } from '../modules/task-queue/task-queue.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('APP_INFO') private readonly appInfo: AppInfo,
    private readonly taskQueueService: TaskQueueService,
    private readonly fileWatcherService: FileWatcherService,
    private readonly fileMoveService: FileMoveService,
    private readonly dbRegisterService: DbRegisterService,
  ) {}

  onModuleInit() {
    this.logger.log(`Initializing file watcher`);
    this.fileWatcherService.start(this.appInfo.path);
  }

  @OnEvent('file.added')
  async handleFileAdded(filePath: string) {
    this.taskQueueService.addTask(filePath);
  }

  @OnEvent('task.added')
  handleTask(task: Task) {
    switch (this.appInfo.type) {
      case 'mail':
        this.handleIncomingMail(task);
        break;
      case 'ftp':
        this.handleIncomingFtp(task);
        break;
      case 'outftp':
        break;
      default:
        break;
    }
  }

  async handleIncomingMail(task: Task) {
    const res1 = await this.fileMoveService.start(this.appInfo.path, task.data);
    await this.dbRegisterService.start(res1);
    this.taskQueueService.completeTask(task);
  }

  async handleIncomingFtp(_: Task) {}
}
