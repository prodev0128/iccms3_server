import { Module } from '@nestjs/common';

import { config } from '@app/config';
import { LoggerModule } from '@app/logger';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  imports: [LoggerModule.forRoot(config.admin.name)],
  providers: [AdminService],
})
export class AdminModule {}
