import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';
import { GlobalsModule } from '@app/globals';
import { config } from '@app/globals/config';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';

import { MediaModule } from '../media/media.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, GlobalsModule, JwtModule, LoggerModule.forRoot(config.media.name), MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
