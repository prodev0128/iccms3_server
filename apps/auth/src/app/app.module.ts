import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';
import { config } from '@app/globals/config';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';
import { SetupModule } from '@app/setup';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, JwtModule, LoggerModule.forRoot(config.auth.name), SetupModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
