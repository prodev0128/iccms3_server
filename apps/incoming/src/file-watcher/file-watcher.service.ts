import { Logger, OnModuleDestroy, Scope } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FSWatcher } from 'chokidar';
import chokidar from 'chokidar';
import fs from 'fs-extra';

import { AppInfo } from '@app/globals/config';
import { delay } from '@app/globals/utils';

import { EventType, ProviderName } from '../types';

@Injectable({ scope: Scope.TRANSIENT })
export class FileWatcherService implements OnModuleDestroy {
  private watcher: FSWatcher;
  private watchDirectory = '';
  private appInfo: AppInfo;

  constructor(
    @Inject(ProviderName.GLOBAL_LOGGER) private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async start(watchDirectory: string, appInfo: AppInfo) {
    this.watchDirectory = watchDirectory;
    this.appInfo = appInfo;
    try {
      await fs.mkdir(this.watchDirectory, { recursive: true });

      this.watcher = chokidar.watch(this.watchDirectory, {
        ignored: /^\./, // Ignore dotfiles
        persistent: true, // Keep watching indefinitely
      });

      this.watcher.on('add', async (path) => {
        this.logger.log(`File detected: ${path}`);
        try {
          await this.waitUntilStable(path);
          this.eventEmitter.emit(`${EventType.FileAdded}.${this.appInfo.path}`, path, this.appInfo.path);
        } catch (err) {
          this.logger.error(`File stabilization failed for: ${path}. ${err.message}`);
        }
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

  private async waitUntilStable(path: string, interval = 1000, stableThreshold = 3): Promise<void> {
    let lastSize = -1;
    let stableCount = 0;

    while (true) {
      try {
        const { size } = await fs.stat(path);

        if (size === lastSize) {
          stableCount++;
          if (stableCount >= stableThreshold) {
            return; // File is stable
          }
        } else {
          stableCount = 0;
          lastSize = size;
        }
      } catch {
        this.logger.warn(`Waiting for file to appear or be readable: ${path}`);
        stableCount = 0;
      }

      await delay(interval);
    }
  }
}
