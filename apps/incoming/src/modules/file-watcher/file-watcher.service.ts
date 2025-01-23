import { config } from '@app/config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class FileWatcherService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async start(instanceID: string) {
    try {
      const watchDirectory = path.join(
        config.env.watchDirectory,
        instanceID,
        config.env.progress.before,
      );
      await fs.mkdir(watchDirectory, { recursive: true });
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
      this.logger.log(`FileWatchService/start: ${watchDirectory}`);
    } catch (e) {
      this.logger.error('FileWatchService/start:', e.message);
    }
  }
}
