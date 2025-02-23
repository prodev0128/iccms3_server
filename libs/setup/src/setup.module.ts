import { Module } from '@nestjs/common';

import { SetupService } from './setup.service';

@Module({
  providers: [SetupService],
  exports: [SetupService],
})
export class SetupModule {}
