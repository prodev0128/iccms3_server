import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import path from 'path';

import { Setting, SettingDocument } from '@app/database';
import { AppInfo, config } from '@app/globals/config';
import { DataTypes } from '@app/globals/constants';

import { FileWatcherService } from '../file-watcher/file-watcher.service';
import { TaskQueueService } from '../task-queue/task-queue.service';
import { EventType, ProviderName, Task } from '../types';
import { CompressionTestService } from '../work/compression-test.service';
import { DbRegisterService } from '../work/db-register.service';
import { EmailParserService } from '../work/email-parser.service';
import { FileMoveService } from '../work/file-move.service';
import { FileNameCheckService } from '../work/file-name-check.service';
import { InvoiceCheckService } from '../work/invoice-check.service';
import { OrgFindService } from '../work/org-find.service';

@Injectable()
export class BotService {
  constructor(
    @Inject(ProviderName.APP_INFO) private readonly appInfo: AppInfo,
    @Inject(ProviderName.GLOBAL_LOGGER) private readonly logger: Logger,
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    private readonly taskQueueService: TaskQueueService,
    private readonly emailParserService: EmailParserService,
    private readonly fileWatcherService: FileWatcherService,
    private readonly fileMoveService: FileMoveService,
    private readonly fileNameCheckService: FileNameCheckService,
    private readonly orgFindService: OrgFindService,
    private readonly compressionTestService: CompressionTestService,
    private readonly dbRegisterService: DbRegisterService,
    private readonly invoiceCheckService: InvoiceCheckService,
  ) {}

  @OnEvent(EventType.BotStarted)
  async handleStart() {
    const watchDirectory = path.join(config.env.watchDirectory, this.appInfo.path, config.env.progress.before);
    await this.fileWatcherService.start(watchDirectory);
  }

  @OnEvent(EventType.BotStopped)
  async handleStop() {
    this.fileWatcherService.stop();
    this.logger.log('Incoming bot stopped:', this.appInfo.path);
  }

  @OnEvent(EventType.FileAdded)
  async handleFileAdded(filePath: string) {
    this.logger.log(EventType.FileAdded, this.appInfo.path, ':', filePath);
    this.taskQueueService.addTask(filePath);
  }

  @OnEvent(EventType.TaskAdded)
  async handleTask(task: Task) {
    this.logger.log(EventType.TaskAdded, ':', task.data, this.appInfo.path);
    const fileMoveRes = await this.fileMoveService.start(this.appInfo, task.data);
    const fileNameCheckRes = await this.fileNameCheckService.start(fileMoveRes);
    if (fileNameCheckRes) {
      const orgFindRes = await this.orgFindService.start(fileMoveRes);
      if (this.appInfo.type === DataTypes.EMAIL) {
        // const emailParseRes = await this.emailParserService.start();
      }
      const compressionTestRes = await this.compressionTestService.start(fileMoveRes);
      const dbRegisterRes = await this.dbRegisterService.start(
        this.appInfo,
        fileMoveRes,
        orgFindRes,
        compressionTestRes,
      );
      await this.invoiceCheckService.start(dbRegisterRes);
    }
    this.taskQueueService.completeTask(task);
  }
}
