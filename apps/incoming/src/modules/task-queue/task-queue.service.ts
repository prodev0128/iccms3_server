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
    if (this.countOfTasks('in-progress') >= this.taskThresholdCount) {
      return;
    }
    if (this.countOfTasks() >= this.taskThresholdCount) {
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
      .slice(0, this.taskThresholdCount - this.countOfTasks('in-progress'));
    for (const task of foundTasks) {
      task.status = 'in-progress';
    }
    if (!foundTasks.length) {
      return;
    }
    this.eventEmitter.emit('task.added', foundTasks);
  }

  completeTask(completedTask: Task) {
    const foundIndex = this.tasks.findIndex(
      (task) => task.data === completedTask.data,
    );
    if (foundIndex < 0) {
      return;
    }
    this.tasks.splice(foundIndex, 1);
    this.doTasks();
  }

  countOfTasks(status: 'pending' | 'in-progress' | 'all' = 'all'): number {
    if (status === 'pending' || status === 'in-progress') {
      return this.tasks.filter((task) => task.status === status).length;
    }
    return this.tasks.length;
  }
}
