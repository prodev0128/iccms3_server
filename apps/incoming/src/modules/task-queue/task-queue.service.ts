import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface Task {
  data: string;
  status: 'pending' | 'in-progress';
}

@Injectable()
export class TaskQueueService {
  private tasks: Task[] = [];
  private timer: NodeJS.Timeout | null = null;
  private taskThresholdCount = 10;
  private taskPendingCount = 0;
  private delayBeforeProcessing = 3000;

  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  addTask(data: string) {
    const newTask: Task = {
      data,
      status: 'pending',
    };
    this.tasks.push(newTask);
    this.taskPendingCount++;
    if (this.taskPendingCount > this.taskThresholdCount) {
      this.doTasks();
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.doTasks(), this.delayBeforeProcessing);
  }

  doTasks() {
    if (this.timer) {
      clearTimeout(this.timer); // Clear the timer to avoid duplicate processing
      this.timer = null;
    }
    const foundTasks = this.tasks
      .filter((task) => task.status === 'pending')
      .slice(0, this.taskThresholdCount);
    for (const task of foundTasks) {
      task.status = 'in-progress';
    }
    this.taskPendingCount -= foundTasks.length;
    this.eventEmitter.emit('task.added', foundTasks);
    return foundTasks;
  }
}
