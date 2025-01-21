import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as chokidar from 'chokidar';
import * as fs from 'fs';

@Injectable()
export class FileWatcherService {
  private eventEmitter = new EventEmitter2();

  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @Inject('WATCH_DIRECTORY') private watchDirectory: string,
  ) {}

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
      this.eventEmitter.emit('file.changed', path);
    });
    watcher.on('add', (path) => {
      this.eventEmitter.emit('file.added', path);
    });
    watcher.on('unlink', (path) => {
      this.eventEmitter.emit('file.removed', path);
    });
    this.logger.log(`Watching Directory: ${this.watchDirectory}`);
  }
}
