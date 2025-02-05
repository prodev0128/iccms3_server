import { File, FileDocument } from '@app/database';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs-extra';
import { Model } from 'mongoose';

@Injectable()
export class DbRegisterService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}

  async start(srcPath: string) {
    if (!fs.existsSync(srcPath)) {
      this.logger.warn(`Database register skipped. File not found: ${srcPath}`);
      return;
    }
    try {
      const file = new this.fileModel({
        name: srcPath,
        path: srcPath,
        orgID: srcPath,
      });
      await file.save();
      this.logger.log(`Database successfully registered to: ${srcPath}`);
    } catch (error) {
      this.logger.error(`Error during database registering for file: ${srcPath}. Reason: ${error.message}`);
    }
  }
}
