import { config } from '@app/config';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs-extra';
import path from 'path';

@Injectable()
export class FileWatcherService implements OnModuleDestroy {
  private watcher: FSWatcher;
  private instanceID = '';

  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async start(instanceID: string) {
    this.instanceID = instanceID;
    const watchDirectory = path.join(config.env.watchDirectory, this.instanceID, config.env.progress.before);
    try {
      await fs.mkdir(watchDirectory, { recursive: true });

      this.watcher = chokidar.watch(watchDirectory, {
        ignored: /^\./, // Ignore dotfiles
        persistent: true, // Keep watching indefinitely
      });

      this.watcher.on('add', (path) => {
        this.logger.log(`File added: ${path}`);
        this.eventEmitter.emit(`file.added`, path);
      });

      this.watcher.on('error', (error: any) => {
        this.logger.error(`Error in file watcher for instance ${this.instanceID}: ${error.message}`);
      });

      this.logger.log(`File watcher started for directory: ${watchDirectory}`);
    } catch (error) {
      this.logger.error(`Failed to start file watcher for directory: ${watchDirectory}. Reason: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    if (!this.watcher) {
      return;
    }
    await this.watcher.close();
    this.logger.log(`File watcher ${this.instanceID} stopped.`);
  }
}
