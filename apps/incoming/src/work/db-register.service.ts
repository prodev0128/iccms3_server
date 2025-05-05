import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs-extra';
import { Model, Types } from 'mongoose';
import path from 'path';

import { File, FileDocument, Invoice, InvoiceDocument } from '@app/database';
import { GlobalsService } from '@app/globals';
import { AppInfo, config } from '@app/globals/config';
import { DataTypes, InvoiceStatus, InvoiceTypes } from '@app/globals/constants';
import { textToRegExp } from '@app/globals/utils';

import { ProviderName } from '../types';

@Injectable()
export class DbRegisterService {
  constructor(
    @Inject(ProviderName.GLOBAL_LOGGER) private readonly logger: Logger,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    private readonly globalsService: GlobalsService,
  ) {}

  checkFileType(fileName: string) {
    // Check Part File
    const compressionPartTypes = this.globalsService.getCodes('compressionPartType');
    const foundCompressionPart = compressionPartTypes.find((compressionPartType: any) =>
      fileName.match(textToRegExp(compressionPartType.options.type)),
    );
    if (foundCompressionPart) {
      return {
        name: fileName.replace(
          textToRegExp(foundCompressionPart?.options?.type),
          foundCompressionPart?.options?.originalType,
        ),
        fileType: InvoiceTypes.PART,
      };
    }

    // Check Compression File
    const compressionTypes = this.globalsService.getCodes('compressionType');
    const foundCompression = compressionTypes.find((compressionType: any) => fileName.endsWith(compressionType.value));
    if (foundCompression) {
      return { name: fileName, fileType: InvoiceTypes.COMPRESSION };
    }
    return { name: fileName, fileType: InvoiceTypes.NORMAL };
  }

  checkOrganization(fileName: string) {
    const orgs = this.globalsService.getCodes('org');
    return orgs.find((org: any) => fileName.match(textToRegExp(org?.options?.content)));
  }

  async registerFtp(appInfo: AppInfo, srcPath: string) {
    const fileName = path.basename(srcPath);
    const filePath = path.relative(config.env.watchDirectory, srcPath);
    const fileStats = await fs.stat(srcPath);
    const fileSize = fileStats.size;

    const checkFileTypeResult = this.checkFileType(fileName);
    const foundOrg: any = this.checkOrganization(fileName);

    let invoiceID = null;
    if (checkFileTypeResult.fileType !== InvoiceTypes.NORMAL) {
      const foundInvoiceItem = await this.invoiceModel
        .findOne({ name: checkFileTypeResult.name, status: InvoiceStatus.UNDEFINED, fileType: InvoiceTypes.PART })
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

  async start(appInfo: AppInfo, srcPath: string, org: object | null, compressionInfo: object) {
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
