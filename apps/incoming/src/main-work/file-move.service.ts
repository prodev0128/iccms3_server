import { Logger } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { AppInfo, config } from '@app/globals/config';
import { delay } from '@app/globals/utils';

import { ProviderName } from '../types';

@Injectable()
export class FileMoveService {
  constructor(@Inject(ProviderName.GLOBAL_LOGGER) private readonly logger: Logger) {}

  async start(appInfo: AppInfo, srcPath: string) {
    if (!fs.existsSync(srcPath)) {
      this.logger.warn(`File move skipped. File not found: ${srcPath}`);
      return;
    }
    const srcDir = path.join(config.env.watchDirectory, appInfo.path, config.env.progress.before);
    const fileName = path.relative(srcDir, srcPath);
    const destPath = path.join(config.env.watchDirectory, appInfo.path, config.env.progress.registering, fileName);
    const destDir = path.dirname(destPath);
    while (true) {
      try {
        if (!fs.existsSync(srcPath)) {
          this.logger.warn(`File move skipped. File not found: ${srcPath}`);
          return;
        }
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
