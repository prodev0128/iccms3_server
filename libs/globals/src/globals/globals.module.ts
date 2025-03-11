import { Global, Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';

import { GlobalsService } from './globals.service';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [GlobalsService],
  exports: [GlobalsService],
})
export class GlobalsModule {}
