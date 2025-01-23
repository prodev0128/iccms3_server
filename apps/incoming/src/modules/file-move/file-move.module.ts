import { Module } from '@nestjs/common';

import { FileMoveService } from './file-move.service';

@Module({
  providers: [FileMoveService],
  exports: [FileMoveService],
})
export class FileMoveModule {}
