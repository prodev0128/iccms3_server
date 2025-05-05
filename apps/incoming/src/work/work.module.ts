import { Module } from '@nestjs/common';

import { CompressionTestService } from './compression-test.service';
import { DbRegisterService } from './db-register.service';
import { FileMoveService } from './file-move.service';
import { FileNameCheckService } from './file-name-check.service';
import { InvoiceCheckService } from './invoice-check.service';
import { OrgFindService } from './org-find.service';

@Module({
  providers: [
    FileMoveService,
    FileNameCheckService,
    OrgFindService,
    CompressionTestService,
    OrgFindService,
    DbRegisterService,
    InvoiceCheckService,
  ],
  exports: [],
})
export class WorkModule {}
