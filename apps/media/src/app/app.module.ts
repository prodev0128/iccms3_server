import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';
import { GlobalsModule } from '@app/globals';
import { config } from '@app/globals/config';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';
import { SetupModule } from '@app/setup';

import { MediaModule } from '../media/media.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    GlobalsModule,
    JwtModule,
    LoggerModule.forRoot(config.media.name),
    SetupModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
