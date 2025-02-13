import { Module } from '@nestjs/common';

import { config } from '@app/config';
import { DatabaseModule } from '@app/database';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [DatabaseModule, LoggerModule.forRoot(config.api.name)],
  providers: [],
})
export class AppModule {}
