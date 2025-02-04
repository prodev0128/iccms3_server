import { config } from '@app/config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class FileWatcherService {
  private watcher: chokidar.FSWatcher;

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

      this.watcher = chokidar.watch(watchDirectory, {
        ignored: /^\./, // Ignore dotfiles
        persistent: true, // Keep watching indefinitely
      });

      this.watcher.on('add', async (path) => {
        this.logger.log(`File added: ${path}`);
        this.eventEmitter.emit(`file.added`, path);
      });

      this.watcher.on('error', (error) => {
        this.logger.error(
          `Error in file watcher for instance ${instanceID}: ${error.message}`,
        );
      });

      this.logger.log(`File watcher started for directory: ${watchDirectory}`);
    } catch (error) {
      this.logger.error(
        `Failed to start file watcher for directory: ${watchDirectory}. Reason: ${error.message}`,
      );
    }
  }

  async stop() {
    if (this.watcher) {
      await this.watcher.close();
      this.logger.log(`File watcher stopped.`);
    }
  }
}
