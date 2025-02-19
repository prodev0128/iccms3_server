import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Code, CodeDocument, CodeOption, CodeOptionDocument } from '@app/database';

import { CodeDto } from './code.dto';
import { CodeOptionDto } from './codeoption.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
    @InjectModel(CodeOption.name) private codeOptionModel: Model<CodeOptionDocument>,
  ) {}

  async findAllCodeOptions(searchText?: string) {
    if (!searchText) {
      return this.codeOptionModel.find().exec();
    }
    return this.codeOptionModel
      .find()
      .or([
        { name: { $options: 'i', $regex: `.*${searchText}.*` } },
        { type: { $options: 'i', $regex: `.*${searchText}.*` } },
      ])
      .exec();
  }

  async findOneCodeOption(id: string) {
    return this.codeModel.findById(id).exec();
  }

  async createCodeOption(codeOptionDto: CodeOptionDto) {
    const newUser = new this.codeOptionModel(codeOptionDto);
    return newUser.save();
  }

  async updateCodeOption(id: string, codeOptionDto: CodeOptionDto) {
    return this.codeModel.findByIdAndUpdate(id, codeOptionDto).exec();
  }

  async updateCodeOptionPartial(id: string, codeOptionDto: CodeOptionDto) {
    return this.codeModel.findByIdAndUpdate(id, codeOptionDto).exec();
  }

  async removeCodeOption(id: string) {
    return this.codeModel.findByIdAndDelete(id).exec();
  }

  async findAllCodes() {
    return this.codeOptionModel.find().exec();
  }

  async findOneCode(id: string) {
    return this.codeOptionModel.findById(id).exec();
  }

  async createCode(codeDto: CodeDto) {
    const newUser = new this.codeOptionModel(codeDto);
    return newUser.save();
  }

  async updateCode(id: string, codeDto: CodeDto) {
    return this.codeOptionModel.findByIdAndUpdate(id, codeDto).exec();
  }

  async updateCodePartial(id: string, codeDto: CodeDto) {
    return this.codeOptionModel.findByIdAndUpdate(id, codeDto).exec();
  }

  async removeCode(id: string) {
    return this.codeOptionModel.findByIdAndDelete(id).exec();
  }
}
