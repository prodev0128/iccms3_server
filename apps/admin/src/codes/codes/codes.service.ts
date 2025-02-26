import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Code, CodeDocument } from '@app/database';
import { filterQueryBuilder, sortQueryBuilder } from '@app/utils';

import { CodeDto } from '../dto/code.dto';

@Injectable()
export class CodesService {
  constructor(@InjectModel(Code.name) private codeModel: Model<CodeDocument>) {}

  async findCodes(codeOptionID: string, page: number, pageSize: number, filterModel: string, sortModel: string) {
    const codeQuery = { optionID: new Types.ObjectId(codeOptionID) };
    const filterQuery = filterQueryBuilder(filterModel, ['name']);
    const sortQuery = sortQueryBuilder(sortModel);
    const codes = await this.codeModel
      .find({ $and: [codeQuery, filterQuery] })
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    const totalCount = await this.codeModel.countDocuments({ $and: [codeQuery, filterQuery] }).exec();
    return { codes, totalCount };
  }

  async findCode(id: string) {
    return this.codeModel.findById(id).exec();
  }

  async createCode(codeDto: CodeDto) {
    const newCode = new this.codeModel({ ...codeDto, optionID: new Types.ObjectId(codeDto.optionID) });
    return newCode.save();
  }

  async updateCode(id: string, codeDto: CodeDto) {
    delete codeDto.optionID;
    return this.codeModel.findByIdAndUpdate(id, codeDto, { new: true }).exec();
  }

  async removeCode(id: string) {
    return this.codeModel.findByIdAndDelete(id).exec();
  }
}
