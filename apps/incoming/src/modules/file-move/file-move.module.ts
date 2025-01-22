import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { FileMoveService } from './file-move.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [FileMoveService],
  exports: [FileMoveService],
})
export class FileMoveModule {}
