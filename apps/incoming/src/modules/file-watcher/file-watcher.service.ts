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
        this.logger.warn(
          `Existing file watcher for instance ${instanceID} was stopped and replaced.`,
        );
      }
      const watcher = chokidar.watch(watchDirectory, {
        ignored: /^\./, // Ignore dotfiles
        persistent: true, // Keep watching indefinitely
      });
      watcher.on('add', async (path) => {
        this.eventEmitter.emit(`file.added.${instanceID}`, path);
      });
      watcher.on('error', (error) => {
        this.logger.error(
          `Error in file watcher for instance ${instanceID}: ${error.message}`,
        );
      });
      this.watchers.set(instanceID, watcher);
      this.logger.log(`File watcher started for directory: ${watchDirectory}`);
    } catch (error) {
      this.logger.error(
        `Failed to start file watcher for directory: ${watchDirectory}. Reason: ${error.message}`,
      );
    }
  }

  async stop(instanceID: string) {
    if (this.watchers.has(instanceID)) {
      await this.watchers.get(instanceID).close();
      this.watchers.delete(instanceID);
      this.logger.log(`File watcher stopped for instance: ${instanceID}`);
    } else {
      this.logger.warn(
        `No active file watcher found for instance: ${instanceID}`,
      );
    }
  }
}
