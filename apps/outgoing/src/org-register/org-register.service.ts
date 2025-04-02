import { Logger } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { File, FileDocument } from '@app/database';
import { GlobalsService } from '@app/globals';

@Injectable()
export class OrgRegisterService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private readonly globalsService: GlobalsService,
  ) {}

  async start(fileID: string) {
    const orgData = this.globalsService.getCodes('org');
    console.log(fileID, orgData);
  }
}
