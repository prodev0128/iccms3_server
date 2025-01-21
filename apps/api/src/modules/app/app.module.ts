import { config } from '@app/config';
import { DatabaseModule } from '@app/database';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, LoggerModule.forRoot(config.api.name)],
  providers: [],
})
export class AppModule {}
