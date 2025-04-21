import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { CompressionTestModule } from '../compression-test/compression-test.module';
import { DbRegisterModule } from '../db-register/db-register.module';
import { EmailParserModule } from '../email-parser/email-parser.module';
import { FileMoveModule } from '../file-move/file-move.module';
import { FileNameCheckModule } from '../file-name-check/file-name-check.module';
import { FileWatcherModule } from '../file-watcher/file-watcher.module';
import { InvoiceCheckModule } from '../invoice-check/invoice-check.module';
import { OrgFindModule } from '../org-find/org-find.module';
import { TaskQueueModule } from '../task-queue/task-queue.module';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    FileWatcherModule,
    FileMoveModule,
    FileNameCheckModule,
    OrgFindModule,
    CompressionTestModule,
    EmailParserModule,
    DbRegisterModule,
    InvoiceCheckModule,
    TaskQueueModule,
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
