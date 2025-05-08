import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import fs from 'fs-extra';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from '@app/database';

@Injectable()
export class SeederService {
  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  async seed() {
    const seedData = JSON.parse(fs.readFileSync('./seed-data.json', 'utf8'));
    console.log('seedData', seedData);
  }
}
