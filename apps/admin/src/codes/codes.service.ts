import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, type UserDocument } from '@app/database';

import { CodeDto } from './code.dto';

@Injectable()
export class CodesService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async create(userDto: CodeDto) {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }

  async update(id: string, userDto: CodeDto) {
    return this.userModel.findByIdAndUpdate(id, userDto).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
