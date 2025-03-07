import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';
import { config } from '@app/globals/config';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';
import { SetupModule } from '@app/setup';

import { CodesModule } from '../codes/codes.module';
import { SettingsModule } from '../settings/settings.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule,
    LoggerModule.forRoot(config.admin.name),
    SetupModule,
    UsersModule,
    CodesModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
