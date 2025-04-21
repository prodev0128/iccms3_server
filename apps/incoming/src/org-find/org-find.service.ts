import { Logger } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import path from 'path';

import { File, FileDocument } from '@app/database';
import { GlobalsService } from '@app/globals';
import { textToRegExp } from '@app/globals/utils';

@Injectable()
export class OrgFindService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private readonly globalsService: GlobalsService,
  ) {}

  async start(srcPath: string) {
    const fileName = path.basename(srcPath);
    const orgs = this.globalsService.getCodes('org');
    return orgs.find((org: any) => fileName.match(textToRegExp(org?.options?.content)));
  }
}
