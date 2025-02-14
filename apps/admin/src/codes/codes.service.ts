import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Code, CodeDocument, CodeOption, CodeOptionDocument } from '@app/database';

import { CodeDto } from './code.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
    @InjectModel(CodeOption.name) private codeOptionModel: Model<CodeOptionDocument>,
  ) {}
  async findAllCodeOptions() {
    return this.codeModel.find().exec();
  }

  async findOneCodeOption(id: string) {
    return this.codeModel.findById(id).exec();
  }

  async createCodeOption(userDto: CodeDto) {
    const newUser = new this.codeModel(userDto);
    return newUser.save();
  }

  async updateCodeOption(id: string, userDto: CodeDto) {
    return this.codeModel.findByIdAndUpdate(id, userDto).exec();
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

  async createCode(userDto: CodeDto) {
    const newUser = new this.codeOptionModel(userDto);
    return newUser.save();
  }

  async updateCode(id: string, userDto: CodeDto) {
    return this.codeOptionModel.findByIdAndUpdate(id, userDto).exec();
  }

  async removeCode(id: string) {
    return this.codeOptionModel.findByIdAndDelete(id).exec();
  }
}
