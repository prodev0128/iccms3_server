import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Code, CodeDocument } from '@app/database';

@Injectable()
export class GlobalsService implements OnModuleInit {
  private codes: any = [];

  constructor(
    @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    await this.fetchAllCodes();
  }

  async fetchAllCodes() {
    const allCodes = await this.codeModel.find().exec();
    this.codes = allCodes.reduce((total, code) => {
      const { type } = code;
      if (!total[type]) {
        total[type] = [];
      }
      total[type] = total[type].concat(code);
      return total;
    }, {});
    this.logger.log('Load Codes Successfully.');
  }

  getCodes(codeOption: string) {
    return this.codes[codeOption] || [];
  }
}
