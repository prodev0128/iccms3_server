import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CodeOption, CodeOptionDocument } from '@app/database';
import { filterQueryBuilder, sortQueryBuilder } from '@app/utils';

import { CodeOptionDto } from '../dto/codeoption.dto';

@Injectable()
export class CodeOptionsService {
  constructor(@InjectModel(CodeOption.name) private codeOptionModel: Model<CodeOptionDocument>) {}

  async findCodeOptions(page: number, pageSize: number, filterModel: string, sortModel: string) {
    const filterQuery = filterQueryBuilder(filterModel, ['name', 'type']);
    const sortQuery = sortQueryBuilder(sortModel);
    const codeOptions = await this.codeOptionModel
      .find(filterQuery)
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    const totalCount = await this.codeOptionModel.countDocuments(filterQuery).exec();
    return { codeOptions, totalCount };
  }

  async findCodeOption(id: string) {
    return this.codeOptionModel.findById(id).exec();
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
