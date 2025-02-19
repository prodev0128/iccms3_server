import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '@app/database';

import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, userDto: UserDto) {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true, overwrite: true, runValidators: true }).exec();
  }

  async updatePartial(id: string, userDto: UserDto) {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true, runValidators: true }).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
