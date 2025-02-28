import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { File, FileDocument } from '@app/database';
import { filterQueryBuilder, sortQueryBuilder } from '@app/globals/query-builder';

import { FileDto } from './dto/file.dto';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async findFiles(page: number, pageSize: number, filterModel: string, sortModel: string) {
    const filterQuery = filterQueryBuilder(filterModel, ['userID', 'name']);
    const sortQuery = sortQueryBuilder(sortModel);
    const users = await this.fileModel
      .find(filterQuery)
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    const totalCount = await this.fileModel.countDocuments(filterQuery).exec();
    return { totalCount, users };
  }

  async createFile(fileDto: FileDto) {
    const user = new this.fileModel(fileDto);
    return await user.save();
  }

  async updateFile(id: string, fileDto: FileDto) {
    return this.fileModel.findByIdAndUpdate(id, fileDto, { new: true }).exec();
  }

  async removeFile(id: string) {
    return this.fileModel.findByIdAndDelete(id).exec();
  }
}
