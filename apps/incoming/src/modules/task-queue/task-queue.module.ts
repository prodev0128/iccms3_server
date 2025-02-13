import { Module } from '@nestjs/common';

import { TaskQueueService } from './task-queue.service';

@Module({
  exports: [TaskQueueService],
  providers: [TaskQueueService],
})
export class TaskQueueModule {}
