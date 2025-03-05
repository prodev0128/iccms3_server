import { Global, Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';
import { config } from '@app/globals/config';
import { LoggerModule } from '@app/logger';

@Global()
@Module({
  imports: [LoggerModule.forRoot(`${config.globals.name}`), DatabaseModule],
  providers: [],
  exports: [],
})
export class GlobalsModule {}
