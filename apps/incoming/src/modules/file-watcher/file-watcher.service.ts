import { config } from '@app/config';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileWatcherService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  start(instanceID: string) {
    try {
      const watchDirectory = path.join(
        config.env.watchDirectory,
        instanceID,
        config.env.progress.before,
      );
      fs.mkdirSync(watchDirectory, { recursive: true });
      const watcher = chokidar.watch(watchDirectory, {
        ignored: /^\./, // Ignore dotfiles
        persistent: true, // Keep watching indefinitely
      });
      watcher.on('change', (path) => {
        this.eventEmitter.emit(
          `file.added.${instanceID}`,
          path,
          watchDirectory,
        );
      });
      watcher.on('add', (path) => {
        this.eventEmitter.emit(
          `file.added.${instanceID}`,
          path,
          watchDirectory,
        );
      });
      this.logger.log(`Watching Directory: ${watchDirectory}`);
    } catch (err) {
      this.logger.error('Error while watching directory:', err);
    }
  }
}
