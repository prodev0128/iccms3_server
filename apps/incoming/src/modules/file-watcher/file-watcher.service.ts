import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as chokidar from 'chokidar';
import * as fs from 'fs';

@Injectable()
export class FileWatcherService implements OnModuleInit {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  // Path to the directory to watch
  private watchDirectory = './watched-directory/ftp';

  onModuleInit() {
    try {
      fs.mkdirSync(this.watchDirectory, { recursive: true });
      console.log(`Directory created at ${this.watchDirectory}`);
    } catch (err) {
      console.error('Error creating directory:', err);
    }
    this.watchFileChanges();
  }

  watchFileChanges() {
    const watcher = chokidar.watch(this.watchDirectory, {
      ignored: /^\./, // Ignore dotfiles
      persistent: true, // Keep watching indefinitely
    });

    watcher.on('change', (path) => {
      console.log(`File changed: ${path}`);
      this.eventEmitter.emit('file.changed', path);
    });

    watcher.on('add', (path) => {
      console.log(`File added: ${path}`);
      this.eventEmitter.emit('file.added', path);
    });

    watcher.on('unlink', (path) => {
      console.log(`File removed: ${path}`);
      this.eventEmitter.emit('file.removed', path);
    });
  }
}
