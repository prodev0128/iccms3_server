import { config } from '@app/config';
import { DatabaseModule } from '@app/database';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule, DatabaseModule, LoggerModule.forRoot(config.auth.name)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
