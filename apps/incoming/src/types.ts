export enum EventType {
  FileAdded = 'file.added',
  TaskAdded = 'task.added',
  BotStarted = 'bot.started',
  BotStopped = 'bot.stopped',
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
}

export interface Task {
  data: string;
  status: TaskStatus;
}

export enum ProviderName {
  EVENT_EMITTER = 'EVENT_EMITTER',
  APP_INFO = 'APP_INFO',
  GLOBAL_LOGGER = 'GLOBAL_LOGGER',
}
