import { Module } from '@nestjs/common';

import { CodesController } from './codes.controller';
import { CodesService } from './codes.service';

@Module({
  controllers: [CodesController],
  imports: [],
  providers: [CodesService],
})
export class CodesModule {}
