import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { SettingDto } from './dto/setting.dto';
import { SettingsService } from './settings.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findSettings() {
    return this.settingsService.findSettings();
  }

  @Post()
  createSetting(@Body() settingDto: SettingDto) {
    return this.settingsService.createSetting(settingDto);
  }

  @Put(':id')
  updateSetting(@Param('id') id: string, @Body() settingDto: SettingDto) {
    return this.settingsService.updateSetting(id, settingDto);
  }

  @Delete(':id')
  removeSetting(@Param('id') id: string) {
    return this.settingsService.removeSetting(id);
  }
}
