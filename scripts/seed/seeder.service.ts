import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs-extra';
import { Model } from 'mongoose';
import path from 'path';
import { Code, CodeDocument, Setting, SettingDocument, User, UserDocument } from '@app/database';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
  ) {}

  async seed() {
    try {
      const filePath = path.resolve(__dirname, 'seed-data.json');
      const seedData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const findAnyOne = await this.codeModel.findOne();
      if (findAnyOne) {
        console.log('Data already exists in the database.');
        return;
      }
      // await this.userModel.insertMany(seedData.users);
      // await this.settingModel.insertMany(seedData.settings);
      await this.codeModel.insertMany(seedData.codes);
    } catch (e) {
      console.log('e', e);
    }
  }
}
