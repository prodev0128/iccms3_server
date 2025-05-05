import { Logger } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EventType, ProviderName, Task, TaskStatus } from '../types';

@Injectable()
export class TaskQueueService {
  private tasks: Task[] = [];
  private taskThresholdCount = 10;

  constructor(
    @Inject(ProviderName.GLOBAL_LOGGER) private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  addTask(data: string) {
    const newTask: Task = {
      data,
      status: TaskStatus.Pending,
    };
    this.tasks.push(newTask);
    this.doTasks();
  }

  doTasks() {
    if (this.countOfTasks(TaskStatus.InProgress) >= this.taskThresholdCount) {
      return;
    }
    const foundTask = this.tasks.find((task) => task.status === TaskStatus.Pending);
    if (!foundTask) {
      return;
    }
    foundTask.status = TaskStatus.InProgress;
    this.eventEmitter.emit(EventType.TaskAdded, foundTask);
  }

  completeTask(completedTask: Task) {
    const foundIndex = this.tasks.findIndex((task) => task.data === completedTask.data);
    if (foundIndex < 0) {
      return;
    }
    this.tasks.splice(foundIndex, 1);
    this.doTasks();
  }

  countOfTasks(status?: TaskStatus): number {
    return status ? this.tasks.filter((task) => task.status === status).length : this.tasks.length;
  }
}
