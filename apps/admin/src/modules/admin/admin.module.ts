import { config } from '@app/config';
import { LoggerModule } from '@app/logger';
import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [LoggerModule.forRoot(config.admin.name)],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
