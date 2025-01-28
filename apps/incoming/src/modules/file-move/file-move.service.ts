import { config } from '@app/config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class FileMoveService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async start(instanceID: string, orgPath: string) {
    if (!fs.existsSync(orgPath)) {
      this.logger.warn(`File move skipped. File not found: ${orgPath}`);
      return;
    }
    const orgDir = path.join(
      config.env.watchDirectory,
      instanceID,
      config.env.progress.before,
    );
    const fileName = path.relative(orgDir, orgPath);
    const destPath = path.join(
      config.env.watchDirectory,
      instanceID,
      config.env.progress.during,
      fileName,
    );
    const destDir = path.dirname(destPath);
    try {
      await fs.mkdir(destDir, { recursive: true });
      await fs.rename(orgPath, destPath);
      this.logger.log(`File successfully moved to: ${destPath}`);
      this.eventEmitter.emit(`file.moved.${instanceID}`, destPath);
    } catch (error) {
      this.logger.error(
        `Failed to move file: ${orgPath}. Retrying in 10 seconds. Reason: ${error.message}`,
      );
      setTimeout(() => this.start(instanceID, orgPath), 10000);
    }
  }
}
