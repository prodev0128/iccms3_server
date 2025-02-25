import { Module } from '@nestjs/common';

import { CodeOptionsController } from './code-options/code-options.controller';
import { CodeOptionsService } from './code-options/code-options.service';
import { CodesController } from './codes/codes.controller';
import { CodesService } from './codes/codes.service';

@Module({
  imports: [],
  controllers: [CodeOptionsController, CodesController],
  providers: [CodeOptionsService, CodesService],
})
export class CodesModule {}
