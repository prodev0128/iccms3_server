import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Setting, SettingDocument } from '@app/database';

import { SettingDto } from './dto/setting.dto';

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  async findSettings() {
    const settings = await this.settingModel.find().exec();
    return { settings };
  }

  async createSetting(settingDto: SettingDto) {
    const setting = new this.settingModel(settingDto);
    return await setting.save();
  }

  async updateSetting(id: string, settingDto: SettingDto) {
    return this.settingModel.findByIdAndUpdate(id, settingDto, { new: true }).exec();
  }

  async removeSetting(id: string) {
    return this.settingModel.findByIdAndDelete(id).exec();
  }
}
