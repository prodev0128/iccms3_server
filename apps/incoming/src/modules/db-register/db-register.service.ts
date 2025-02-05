import { File, FileDocument } from '@app/database';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs-extra';
import { Model } from 'mongoose';

@Injectable()
export class DbRegisterService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}

  async start(orgPath: string) {
    try {
      if (!fs.existsSync(orgPath)) {
        this.logger.warn(
          `Database register skipped. File not found: ${orgPath}`,
        );
      }
      const file = new this.fileModel({
        name: orgPath,
      });
      await file.save();
      this.logger.log(`Database successfully registered to: ${orgPath}`);
    } catch (error) {
      this.logger.error(
        `Error during database registering for file: ${orgPath}. Reason: ${error.message}`,
      );
    }
  }
}
