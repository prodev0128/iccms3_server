import { Module } from '@nestjs/common';

import { FileNameCheckService } from './file-name-check.service';

@Module({
  exports: [FileNameCheckService],
  providers: [FileNameCheckService],
})
export class FileNameCheckModule {}
