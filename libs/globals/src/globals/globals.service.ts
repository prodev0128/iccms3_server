import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Code, CodeDocument, CodeOption, CodeOptionDocument } from '@app/database';

@Injectable()
export class GlobalsService implements OnModuleInit {
  constructor(
    @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
    @InjectModel(CodeOption.name) private codeOptionModel: Model<CodeOptionDocument>,
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
  ) {}

  onModuleInit() {
    const res = this.codeOptionModel.find().exec();
    console.log('res', res);
  }
}
