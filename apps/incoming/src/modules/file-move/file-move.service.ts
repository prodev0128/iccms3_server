import { config } from '@app/config';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileMoveService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  start(instanceID: string, orgPath: string, basePath: string) {
    if (!fs.existsSync(orgPath)) {
      return;
    }
    const fileName = orgPath.split(basePath)[1];
    const destPath = path.join(
      config.env.watchDirectory,
      instanceID,
      config.env.progress.during,
      fileName,
    );
    const destDir = path.dirname(destPath);
    try {
      fs.mkdirSync(destDir, { recursive: true });
      fs.renameSync(orgPath, destPath);
      this.eventEmitter.emit(`file.moved.${instanceID}`, destPath, destDir);
    } catch (e) {
      this.logger.error('File Moved', orgPath, destPath, e.message);
      setTimeout(() => {
        this.start(instanceID, orgPath, basePath);
      }, config.env.intervalTime);
    }
  }
}
