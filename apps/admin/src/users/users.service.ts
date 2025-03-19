import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { User, UserDocument } from '@app/database';
import { config } from '@app/globals/config';
import { filterQueryBuilder, sortQueryBuilder } from '@app/globals/query-builder';

import { RolesDto } from './dto/role.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUsers(page: number, pageSize: number, filterModel: string, sortModel: string) {
    const findQuery = filterQueryBuilder(filterModel, ['userID', 'name']);
    const sortQuery = sortQueryBuilder(sortModel);
    const totalCount = await this.userModel.countDocuments(findQuery).exec();
    if (!page) {
      page = 0;
    }
    if (!pageSize) {
      pageSize = totalCount;
    }
    const users = await this.userModel
      .find(findQuery)
      .sort(sortQuery)
      .skip(page * pageSize)
      .limit(pageSize)
      .exec();
    return { totalCount, users };
  }

  async createUser(userDto: UserDto) {
    const hashedPassword = await bcrypt.hash(config.env.initialPassword, 10);
    const user = new this.userModel({
      ...userDto,
      password: hashedPassword,
    });
    return await user.save();
  }

  async updateUser(id: string, userDto: UserDto) {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true }).exec();
  }

  async removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async resetPassword(id: string) {
    const hashedPassword = await bcrypt.hash(config.env.initialPassword, 10);
    return this.userModel.findByIdAndUpdate(id, { password: hashedPassword }).exec();
  }
}
