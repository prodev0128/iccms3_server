import { Module } from '@nestjs/common';

import { DbRegisterService } from './db-register.service';

@Module({
  providers: [DbRegisterService],
  exports: [DbRegisterService],
})
export class DbRegisterModule {}
