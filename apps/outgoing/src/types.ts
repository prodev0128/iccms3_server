export enum EventType {
  FileAdded = 'file.added',
  TaskAdded = 'task.added',
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
}

export interface Task {
  data: string;
  status: TaskStatus;
}
