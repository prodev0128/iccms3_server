import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { User, UserDocument } from '@app/database';

import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async findUsers(page, pageSize, filterModel, sortModel) {
    const filterQuery = {};
    for (const filter of filterModel) {
      if (filter.operator === 'contains') {
        filterQuery[filter.field] = filter.value;
      }
    }
    const users = await this.userModel.find(filterQuery).exec();
    const totalCount = await this.userModel.countDocuments(filterQuery).exec();
    return { totalCount, users };
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
