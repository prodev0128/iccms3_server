import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { config } from '@app/config';
import { User, UserDocument } from '@app/database';
import { filterQueryBuilder, sortQueryBuilder } from '@app/utils';

import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUsers(page: number, pageSize: number, filterModel: string, sortModel: string) {
    const filterQuery = filterQueryBuilder(filterModel, ['userID', 'name']);
    const sortQuery = sortQueryBuilder(sortModel);
    const users = await this.userModel
      .find(filterQuery, { password: 0 })
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    const totalCount = await this.userModel.countDocuments(filterQuery).exec();
    console.log(sortQuery);
    return { totalCount, users };
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, userDto: UserDto) {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true, overwrite: true, runValidators: true }).exec();
  }

  async updatePartial(id: string, userDto: UserDto) {
    return this.userModel.findByIdAndUpdate(id, userDto).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async resetPassword(id: string) {
    console.log(config.env.initialPassword, id);
    const hashedPassword = await bcrypt.hash(config.env.initialPassword, 10);
    return this.userModel.findByIdAndUpdate(id, { password: hashedPassword }).exec();
  }
}
