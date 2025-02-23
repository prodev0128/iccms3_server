import { Module } from '@nestjs/common';

import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';

@Module({
  imports: [],
  controllers: [CodesController],
  providers: [CodesService],
})
export class CodesModule {}
