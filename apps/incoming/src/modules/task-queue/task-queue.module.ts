import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'TASK_QUEUE',
      limiter: {
        max: 5, // Max 5 tasks concurrently
        duration: 0, // Per second
      },
    }),
  ],
  exports: [BullModule],
})
export class TaskQueueModule {}
