import { Module } from '@nestjs/common';

import { SetupService } from './setup.service';

@Module({
  exports: [SetupService],
  providers: [SetupService],
})
export class SetupModule {}
