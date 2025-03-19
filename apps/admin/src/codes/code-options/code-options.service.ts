import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CodeOption, CodeOptionDocument } from '@app/database';
import { filterQueryBuilder, sortQueryBuilder } from '@app/globals/query-builder';

import { CodeOptionDto } from '../dto/code-option.dto';

@Injectable()
export class CodeOptionsService {
  constructor(@InjectModel(CodeOption.name) private codeOptionModel: Model<CodeOptionDocument>) {}

  async findCodeOptions(page: number, pageSize: number, filterModel: string, sortModel: string) {
    const findQuery = filterQueryBuilder(filterModel, ['name', 'type']);
    const sortQuery = sortQueryBuilder(sortModel);
    const totalCount = await this.codeOptionModel.countDocuments(findQuery).exec();
    if (!page) {
      page = 0;
    }
    if (!pageSize) {
      pageSize = totalCount;
    }
    const codeOptions = await this.codeOptionModel
      .find(findQuery)
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    return { codeOptions, totalCount };
  }

  async createCodeOption(codeOptionDto: CodeOptionDto) {
    const newUser = new this.codeOptionModel(codeOptionDto);
    return newUser.save();
  }

  async updateCodeOption(id: string, codeOptionDto: CodeOptionDto) {
    return this.codeOptionModel.findByIdAndUpdate(id, codeOptionDto, { new: true }).exec();
  }

  async removeCodeOption(id: string) {
    return this.codeOptionModel.findByIdAndDelete(id).exec();
  }
}
