import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Code, CodeDocument } from '@app/database';
import { filterQueryBuilder, sortQueryBuilder } from '@app/globals/query-builder';

import { CodeDto } from '../dto/code.dto';

@Injectable()
export class CodesService {
  constructor(@InjectModel(Code.name) private codeModel: Model<CodeDocument>) {}

  async findCodesByType(typeText: string) {
    const types = typeText.split(',').map((type) => type.trim());
    const allCodes = await this.codeModel.find({ type: { $in: types } }).exec();
    return allCodes.reduce((total, code) => {
      const { type } = code;
      if (!total[type]) {
        total[type] = [];
      }
      total[type] = total[type].concat(code);
      return total;
    }, {});
  }

  async findCodes(type: string, page: number, pageSize: number, filterModel: string, sortModel: string) {
    const filterQuery = filterQueryBuilder(filterModel, ['name']);
    const sortQuery = sortQueryBuilder(sortModel);
    const findQuery = { $and: [{ type }, filterQuery] };
    const totalCount = await this.codeModel.countDocuments(findQuery).exec();
    if (!page) {
      page = 0;
    }
    if (!pageSize) {
      pageSize = totalCount;
    }
    const codes = await this.codeModel
      .find(findQuery)
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    return { codes, totalCount };
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
