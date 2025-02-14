import { Module } from '@nestjs/common';

import { config } from '@app/config';
import { DatabaseModule } from '@app/database';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';

import { AppController } from '../../../admin/src/app/app.controller';
import { AppService } from '../../../admin/src/app/app.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AppController],
  imports: [DatabaseModule, JwtModule, LoggerModule.forRoot(config.auth.name), AuthModule],
  providers: [AppService],
})
export class AppModule {}
