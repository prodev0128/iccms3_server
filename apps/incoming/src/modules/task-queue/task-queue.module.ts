import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'TASK_QUEUE',
      redis: {
        host: 'localhost', // Redis connection (update as needed)
        port: 6379,
      },
    }),
  ],
  exports: [BullModule],
})
export class TaskQueueModule {}
