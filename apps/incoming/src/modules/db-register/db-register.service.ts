import { File, FileDocument } from '@app/database';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs-extra';
import { Model } from 'mongoose';

@Injectable()
export class DbRegisterService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}

  async start(instanceID: string, orgPath: string) {
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

      // emit event
      this.eventEmitter.emit(`db.registered.${instanceID}`, orgPath);
    } catch (error) {
      this.logger.error(
        `Error during database registering for file: ${orgPath}. Reason: ${error.message}`,
      );
    }
  }
}
