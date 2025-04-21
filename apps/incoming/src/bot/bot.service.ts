import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import path from 'path';

import { Setting, SettingDocument } from '@app/database';
import { AppInfo, config } from '@app/globals/config';
import { DataTypes, SettingKeys } from '@app/globals/constants';

import { CompressionTestService } from '../compression-test/compression-test.service';
import { DbRegisterService } from '../db-register/db-register.service';
import { EmailParserService } from '../email-parser/email-parser.service';
import { FileMoveService } from '../file-move/file-move.service';
import { FileNameCheckService } from '../file-name-check/file-name-check.service';
import { FileWatcherService } from '../file-watcher/file-watcher.service';
import { InvoiceCheckService } from '../invoice-check/invoice-check.service';
import { OrgFindService } from '../org-find/org-find.service';
import { TaskQueueService } from '../task-queue/task-queue.service';
import { EventType, Task } from '../types';

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
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

  onModuleInit() {
    this.check();
  }

  onModuleDestroy() {
    this.stop();
  }

  async check() {
    const flagItem = await this.settingModel.findOne({ key: SettingKeys.AUTO_INCOMING });
    console.log('flagItem', flagItem);
    if (!flagItem || !flagItem.value) {
      return;
    }
    this.logger.log(`Incoming bot started`);
    for (const appInfo of config.env.watchSubDirs) {
      const watchDirectory = path.join(config.env.watchDirectory, appInfo.path, config.env.progress.before);
      await this.fileWatcherService.start(watchDirectory);
    }
  }

  stop() {
    this.fileWatcherService.stop();
    this.logger.log(`Incoming bot stopped`);
  }

  @OnEvent(EventType.FileAdded)
  async handleFileAdded(filePath: string) {
    this.taskQueueService.addTask(filePath);
  }

  // @OnEvent(EventType.TaskAdded)
  // async handleTask(task: Task) {
  //   const fileMoveRes = await this.fileMoveService.start(this.appInfo, task.data);
  //   const fileNameCheckRes = await this.fileNameCheckService.start(fileMoveRes);
  //   if (fileNameCheckRes) {
  //     const orgFindRes = await this.orgFindService.start(fileMoveRes);
  //     if (this.appInfo.type === DataTypes.EMAIL) {
  //       // const emailParseRes = await this.emailParserService.start();
  //     }
  //     const compressionTestRes = await this.compressionTestService.start(fileMoveRes);
  //     const dbRegisterRes = await this.dbRegisterService.start(
  //       this.appInfo,
  //       fileMoveRes,
  //       orgFindRes,
  //       compressionTestRes,
  //     );
  //     await this.invoiceCheckService.start(dbRegisterRes);
  //   }
  //   this.taskQueueService.completeTask(task);
  // }
}
