import { Logger, OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { AppInfo } from '@app/globals/config';
import { DataTypes } from '@app/globals/constants';

import { DbRegisterService } from '../db-register/db-register.service';
import { FileMoveService } from '../file-move/file-move.service';
import { FileWatcherService } from '../file-watcher/file-watcher.service';
import { TaskQueueService } from '../task-queue/task-queue.service';
import { EventType, Task } from '../types';

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

  @OnEvent(EventType.FileAdded)
  async handleFileAdded(filePath: string) {
    this.taskQueueService.addTask(filePath);
  }

  @OnEvent(EventType.TaskAdded)
  handleTask(task: Task) {
    switch (this.appInfo.type) {
      case DataTypes.EMAIL:
        this.handleIncomingMail(task);
        break;
      case DataTypes.FTP:
        this.handleIncomingFtp(task);
        break;
      case DataTypes.OUTFTP:
        break;
      default:
        break;
    }
  }

  async handleIncomingMail(task: Task) {
    const fileMoveRes = await this.fileMoveService.start(this.appInfo, task.data);
    await this.dbRegisterService.start(this.appInfo, fileMoveRes);
    this.taskQueueService.completeTask(task);
  }

  async handleIncomingFtp(task: Task) {
    const fileMoveRes = await this.fileMoveService.start(this.appInfo, task.data);
    await this.dbRegisterService.start(this.appInfo, fileMoveRes);
    this.taskQueueService.completeTask(task);
  }
}
