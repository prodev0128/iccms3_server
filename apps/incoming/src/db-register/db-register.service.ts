import { Logger } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs-extra';
import { Model, Types } from 'mongoose';
import path from 'path';

import { File, FileDocument, Invoice, InvoiceDocument } from '@app/database';
import { AppInfo, config } from '@app/globals/config';
import { compressionFileExtensions, invoiceFlagTypes, invoiceStatus } from '@app/globals/constants';

@Injectable()
export class DbRegisterService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async register(appInfo: AppInfo, srcPath: string) {
    const srcDir = path.join(config.env.watchDirectory, appInfo.path, config.env.progress.registering);
    const fileName = path.basename(srcPath);
    const filePath = path.relative(srcDir, srcPath);
    const fileExtension = path.extname(srcPath);
    const fileStats = await fs.stat(srcPath);
    const fileSize = fileStats.size;
    const flags = [];
    if (compressionFileExtensions.includes(fileExtension)) {
      flags.push(invoiceFlagTypes.PART);
    }
    const invoice = new this.invoiceModel({
      name: fileName,
      fileType: appInfo.type,
      flags,
      status: invoiceStatus.UNDEFINED,
    });
    const invoiceItem = await invoice.save();
    const file = new this.fileModel({
      name: fileName,
      path: filePath,
      size: fileSize,
      invoiceID: new Types.ObjectId(invoiceItem.id),
    });
    await file.save();
  }

  async start(appInfo: AppInfo, srcPath: string) {
    if (!fs.existsSync(srcPath)) {
      this.logger.warn(`Database register skipped. File not found: ${srcPath}`);
      return;
    }
    try {
      await this.register(appInfo, srcPath);
      this.logger.log(`Database successfully registered to: ${srcPath}`);
    } catch (error) {
      this.logger.error(`Error during database registering for file: ${srcPath}. Reason: ${error.message}`);
    }
  }
}
