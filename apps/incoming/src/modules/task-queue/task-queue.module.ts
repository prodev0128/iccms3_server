import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'TASK_QUEUE',
    }),
  ],
  exports: [BullModule],
})
export class TaskQueueModule {}
