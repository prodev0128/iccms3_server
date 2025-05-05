import { Logger, OnModuleDestroy, Scope } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FSWatcher } from 'chokidar';
import chokidar from 'chokidar';
import fs from 'fs-extra';

import { EventType, ProviderName } from '../types';

@Injectable({ scope: Scope.TRANSIENT })
export class FileWatcherService implements OnModuleDestroy {
  private watcher: FSWatcher;
  private watchDirectory = '';

  constructor(
    @Inject(ProviderName.GLOBAL_LOGGER) private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async start(watchDirectory: string) {
    this.watchDirectory = watchDirectory;
    try {
      await fs.mkdir(this.watchDirectory, { recursive: true });

      this.watcher = chokidar.watch(this.watchDirectory, {
        ignored: /^\./, // Ignore dotfiles
        persistent: true, // Keep watching indefinitely
      });

      this.watcher.on('add', (path) => {
        this.logger.log(`File added: ${path}`);
        this.eventEmitter.emit(EventType.FileAdded, path);
      });

      this.watcher.on('error', (error: Error) => {
        this.logger.error(`Error in file watcher for instance ${this.watchDirectory}: ${error.message}`);
      });

      this.logger.log(`File watcher started for directory: ${this.watchDirectory}`);
    } catch (error) {
      this.logger.error(`Failed to start file watcher for directory: ${this.watchDirectory}. ${error.message}`);
    }
  }

  async stop() {
    if (!this.watcher) {
      return;
    }
    await this.watcher.close();
    this.logger.log(`File watcher ${this.watchDirectory} stopped.`);
  }

  onModuleDestroy() {
    stop();
  }
}
