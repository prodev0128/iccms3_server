import { config } from '@app/config';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as chokidar from 'chokidar';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailParserService {
  private eventEmitter = new EventEmitter2();
  private readonly watchDirectory: string;

  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('EMAIL_PATH') private filePath: string,
  ) {
    this.watchDirectory = path.join(
      config.env.watchDirectory,
      config.env.progress.before,
    );
  }

  getEventEmitter() {
    return this.eventEmitter;
  }

  startWatching() {
    try {
      fs.mkdirSync(this.watchDirectory, { recursive: true });
      this.watchFileChanges();
    } catch (err) {
      console.error('[FileWatcher] Error creating directory:', err);
    }
  }

  watchFileChanges() {
    const watcher = chokidar.watch(this.watchDirectory, {
      ignored: /^\./, // Ignore dotfiles
      persistent: true, // Keep watching indefinitely
    });
    watcher.on('change', (path) => {
      this.eventEmitter.emit('file.changed', path, this.watchDirectory);
    });
    watcher.on('add', (path) => {
      this.eventEmitter.emit('file.changed', path, this.watchDirectory);
    });
    this.logger.log(`Watching Directory: ${this.watchDirectory}`);
  }
}
