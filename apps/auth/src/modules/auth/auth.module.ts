import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigMyModule } from 'libs/config/src';

@Module({
  imports: [ConfigMyModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
