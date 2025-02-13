import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';

import { DbRegisterService } from './db-register.service';

@Module({
  exports: [DbRegisterService],
  imports: [DatabaseModule],
  providers: [DbRegisterService],
})
export class DbRegisterModule {}
