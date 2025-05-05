import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Setting, SettingDocument } from '@app/database';
import { SettingKeys } from '@app/globals/constants';

import { EventType, ProviderName } from '../types';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(ProviderName.GLOBAL_LOGGER) private readonly logger: Logger,
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  getHello(): string {
    return 'Incoming app is working!!!';
  }

  onModuleInit() {
    this.checkWatching();
  }

  onModuleDestroy() {
    this.stopWatching();
  }

  async checkWatching(): Promise<string> {
    const flagItem = await this.settingModel.findOne({ key: SettingKeys.AUTO_INCOMING });

    if (flagItem?.value) {
      this.startWatching();
      return '✅ Incoming app is watching.';
    } else {
      this.stopWatching();
      return '⛔ Incoming app is not watching.';
    }
  }

  startWatching() {
    this.eventEmitter.emit(EventType.BotStarted);
  }

  stopWatching() {
    this.eventEmitter.emit(EventType.BotStopped);
  }
}
