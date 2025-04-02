import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/database';

import { OrgRegisterService } from './org-register.service';

@Module({
  exports: [OrgRegisterService],
  imports: [DatabaseModule],
  providers: [OrgRegisterService],
})
export class OrgRegisterModule {}
