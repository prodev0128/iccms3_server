import { config } from '@app/config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class FileWatcherService {
  private watchers = new Map<string, chokidar.FSWatcher>();

  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async start(instanceID: string) {
    const watchDirectory = path.join(
      config.env.watchDirectory,
      instanceID,
      config.env.progress.before,
    );
    try {
      await fs.mkdir(watchDirectory, { recursive: true });
      if (this.watchers.has(instanceID)) {
        await this.watchers.get(instanceID).close();
        this.watchers.delete(instanceID);
      }
      const watcher = chokidar.watch(watchDirectory, {
        ignored: /^\./, // Ignore dotfiles
        persistent: true, // Keep watching indefinitely
      });
      watcher.on('change', (path) => {
        this.eventEmitter.emit(`file.changed.${instanceID}`, path);
      });
      watcher.on('add', (path) => {
        this.eventEmitter.emit(`file.added.${instanceID}`, path);
      });
      this.watchers.set(instanceID, watcher);
      this.logger.log(`FileWatchService/start: ${watchDirectory}`);
    } catch (error) {
      this.logger.error('FileWatchService/start:', error.message);
    }
  }

  async stop(instanceID: string) {
    if (this.watchers.has(instanceID)) {
      await this.watchers.get(instanceID).close();
      this.watchers.delete(instanceID);
      this.logger.log(`FileWatchService/stop: ${instanceID}`);
    }
  }
}
