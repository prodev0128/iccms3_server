import { Logger } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { config } from '@app/globals/config';
import { delay } from '@app/globals/utils';

@Injectable()
export class FileMoveService {
  constructor(@Inject('GLOBAL_LOGGER') private readonly logger: Logger) {}

  async start(instanceID: string, srcPath: string) {
    if (!fs.existsSync(srcPath)) {
      this.logger.warn(`File move skipped. File not found: ${srcPath}`);
      return;
    }
    const srcDir = path.join(config.env.watchDirectory, instanceID, config.env.progress.before);
    const fileName = path.relative(srcDir, srcPath);
    const destPath = path.join(config.env.watchDirectory, instanceID, config.env.progress.during, fileName);
    const destDir = path.dirname(destPath);
    while (true) {
      try {
        await fs.mkdir(destDir, { recursive: true });
        await fs.rename(srcPath, destPath);
        this.logger.log(`File successfully moved to: ${destPath}`);
        return destPath;
      } catch (error) {
        this.logger.error(`Failed to move file: ${srcPath}. Retrying in 10 seconds. Reason: ${error.message}`);
        await delay(10 * 1000);
      }
    }
  }
}
