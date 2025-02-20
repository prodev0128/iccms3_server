import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Code, CodeDocument, CodeOption, CodeOptionDocument } from '@app/database';
import { delay, filterQueryBuilder, sortQueryBuilder } from '@app/utils';

import { CodeDto } from './code.dto';
import { CodeOptionDto } from './codeoption.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
    @InjectModel(CodeOption.name) private codeOptionModel: Model<CodeOptionDocument>,
  ) {}

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

  async findOneCodeOption(id: string) {
    return this.codeOptionModel.findById(id).exec();
  }

  async createCodeOption(codeOptionDto: CodeOptionDto) {
    const newUser = new this.codeOptionModel(codeOptionDto);
    return newUser.save();
  }

  async updateCodeOption(id: string, codeOptionDto: CodeOptionDto) {
    return this.codeOptionModel.findByIdAndUpdate(id, codeOptionDto).exec();
  }

  async updateCodeOptionPartial(id: string, codeOptionDto: CodeOptionDto) {
    return this.codeOptionModel.findByIdAndUpdate(id, codeOptionDto).exec();
  }

  async removeCodeOption(id: string) {
    return this.codeOptionModel.findByIdAndDelete(id).exec();
  }

  async findCodes(codeOptionType: string, page: number, pageSize: number, filterModel: string, sortModel: string) {
    const codeQuery = { type: codeOptionType };
    console.log(codeQuery);
    const filterQuery = filterQueryBuilder(filterModel, ['name']);
    const sortQuery = sortQueryBuilder(sortModel);
    const codes = await this.codeModel
      .find(codeQuery)
      .find(filterQuery)
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    const totalCount = await this.codeModel.countDocuments({ $and: [codeQuery, filterQuery] }).exec();
    return { codes, totalCount };
  }

  async findOneCode(codeOptionType: string, id: string) {
    return this.codeOptionModel.findById(id).exec();
  }

  async createCode(codeOptionType: string, codeDto: CodeDto) {
    const newUser = new this.codeOptionModel(codeDto);
    return newUser.save();
  }

  async updateCode(codeOptionType: string, id: string, codeDto: CodeDto) {
    return this.codeOptionModel.findByIdAndUpdate(id, codeDto).exec();
  }

  async updateCodePartial(codeOptionType: string, id: string, codeDto: CodeDto) {
    return this.codeOptionModel.findByIdAndUpdate(id, codeDto).exec();
  }

  async removeCode(codeOptionType: string, id: string) {
    return this.codeOptionModel.findByIdAndDelete(id).exec();
  }
}
