import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { File, FileDocument, Invoice, InvoiceDocument } from '@app/database';

import { InvoicesService } from '../invoices/invoices.service';
import { CensorFilesDto } from './dto/censor-files.dto';
import { CheckFilesDto } from './dto/check-files.dto';
import { FileDto } from './dto/file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    private readonly invoicesService: InvoicesService,
  ) {}

  async findFiles(idsText: string) {
    const ids = idsText.split(',').map((item) => new Types.ObjectId(item));

    const findQuery = { invoiceID: { $in: ids } };
    const files = await this.fileModel.find(findQuery).exec();
    const totalCount = await this.fileModel.countDocuments(findQuery).exec();
    return { totalCount, files };
  }

  async createFile(fileDto: FileDto) {
    const file = new this.fileModel(fileDto);
    return await file.save();
  }

  async updateFile(id: string, fileDto: FileDto) {
    return await this.fileModel.findByIdAndUpdate(id, fileDto, { new: true }).exec();
  }

  async censorFiles(censorFilesDto: CensorFilesDto) {
    const findQuery = { _id: { $in: censorFilesDto.ids } };
    const updateQuery = { cenFlag: censorFilesDto.cenFlag };
    await this.fileModel.updateMany(findQuery, updateQuery).exec();

    const fileItems = await this.fileModel.find(findQuery).select(['invoiceID']).exec();
    const invoiceIdsWithoutDuplicates = [...new Set(fileItems.map((item) => item.invoiceID))];
    for (const invoiceID of invoiceIdsWithoutDuplicates) {
      await this.invoicesService.updateInvoiceProgress(invoiceID.toString());
    }
  }

  async checkFiles(_: CheckFilesDto) {}

  async removeFile(id: string) {
    return this.fileModel.findByIdAndDelete(id).exec();
  }
}
