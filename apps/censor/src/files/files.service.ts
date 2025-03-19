import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { File, FileDocument } from '@app/database';

import { FileDto } from './dto/file.dto';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

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
    return this.fileModel.findByIdAndUpdate(id, fileDto, { new: true }).exec();
  }

  async removeFile(id: string) {
    return this.fileModel.findByIdAndDelete(id).exec();
  }
}
