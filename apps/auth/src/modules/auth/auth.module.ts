import { Module } from '@nestjs/common';

import { ConfigEnvModule } from '@app/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigEnvModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
