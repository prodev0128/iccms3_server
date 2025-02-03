import { DatabaseModule } from '@app/database';
import { Module } from '@nestjs/common';

import { DbRegisterService } from './db-register.service';

@Module({
  imports: [DatabaseModule],
  providers: [DbRegisterService],
  exports: [DbRegisterService],
})
export class DbRegisterModule {}
