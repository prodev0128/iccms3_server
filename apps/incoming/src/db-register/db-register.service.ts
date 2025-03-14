import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs-extra';
import { Model, Types } from 'mongoose';
import path from 'path';

import { File, FileDocument, Invoice, InvoiceDocument } from '@app/database';
import { GlobalsService } from '@app/globals';
import { AppInfo, config } from '@app/globals/config';
import { DataTypes, FileTypes, InvoiceStatus } from '@app/globals/constants';

@Injectable()
export class DbRegisterService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    private readonly globalsService: GlobalsService,
  ) {}

  checkFileType(fileName: string) {
    // Check Part File
    const compressionPartTypes = this.globalsService.getCodes('compressionPartType');
    const foundCompressionPart = compressionPartTypes.find((compressionPartType: any) =>
      fileName.match(new RegExp(compressionPartType.options.type, 'i')),
    );
    if (foundCompressionPart) {
      return {
        name: fileName.replace(
          new RegExp(foundCompressionPart?.options?.type, 'i'),
          foundCompressionPart?.options?.originalType,
        ),
        fileType: FileTypes.PART,
      };
    }

    // Check Compression File
    const compressionTypes = this.globalsService.getCodes('compressionType');
    const foundCompression = compressionTypes.find((compressionType: any) => fileName.endsWith(compressionType.value));
    if (foundCompression) {
      return { name: fileName, fileType: FileTypes.COMPRESSION };
    }
    return { name: fileName, fileType: FileTypes.NORMAL };
  }

  checkOrganization(fileName: string) {
    const orgs = this.globalsService.getCodes('org');
    return orgs.find((org: any) => fileName.match(new RegExp(org?.options?.content, 'i')));
  }

  async registerFtp(appInfo: AppInfo, srcPath: string) {
    const srcDir = path.join(config.env.watchDirectory, appInfo.path, config.env.progress.registering);
    const fileName = path.basename(srcPath);
    const filePath = path.relative(srcDir, srcPath);
    const fileStats = await fs.stat(srcPath);
    const fileSize = fileStats.size;

    const checkFileTypeResult = this.checkFileType(fileName);
    const foundOrg: any = this.checkOrganization(fileName);
    console.log('foundOrg', foundOrg, foundOrg?.value);

    let invoiceID = null;
    if (checkFileTypeResult.fileType !== FileTypes.NORMAL) {
      const foundInvoiceItem = await this.invoiceModel
        .findOne({ name: checkFileTypeResult.name, status: InvoiceStatus.UNDEFINED, fileType: FileTypes.PART })
        .exec();
      if (foundInvoiceItem) {
        invoiceID = foundInvoiceItem.id;
      }
    }
    if (!invoiceID) {
      const invoice = new this.invoiceModel({
        name: checkFileTypeResult.name,
        dataType: appInfo.type,
        fileType: checkFileTypeResult.fileType,
        status: InvoiceStatus.UNDEFINED,
        org: foundOrg?.value || '',
      });
      const newInvoiceItem = await invoice.save();
      invoiceID = newInvoiceItem.id;
    }
    const file = new this.fileModel({
      name: fileName,
      path: filePath,
      size: fileSize,
      invoiceID: new Types.ObjectId(invoiceID),
      org: foundOrg?.value || '',
    });
    await file.save();
  }

  async start(appInfo: AppInfo, srcPath: string) {
    if (!fs.existsSync(srcPath)) {
      this.logger.warn(`Database register skipped. File not found: ${srcPath}`);
      return;
    }
    try {
      if (appInfo.type === DataTypes.FTP) {
        await this.registerFtp(appInfo, srcPath);
      }
      this.logger.log(`Database successfully registered to: ${srcPath}`);
    } catch (error) {
      this.logger.error(`Error during database registering for file: ${srcPath}. Reason: ${error.message}`);
    }
  }
}
