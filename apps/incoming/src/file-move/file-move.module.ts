import { Module } from '@nestjs/common';

import { FileMoveService } from './file-move.service';

@Module({
  exports: [FileMoveService],
  providers: [FileMoveService],
})
export class FileMoveModule {}
