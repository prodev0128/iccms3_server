import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';
import { config } from '@app/globals/config';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';

import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DatabaseModule, JwtModule, LoggerModule.forRoot(config.auth.name), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
