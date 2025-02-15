import { Module } from '@nestjs/common';

import { config } from '@app/config';
import { DatabaseModule } from '@app/database';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';

import { AuthModule } from '../auth/auth.module';
import { CodesModule } from '../codes/codes.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [DatabaseModule, JwtModule, LoggerModule.forRoot(config.admin.name), AuthModule, CodesModule, UsersModule],
  providers: [AppService],
})
export class AppModule {}
