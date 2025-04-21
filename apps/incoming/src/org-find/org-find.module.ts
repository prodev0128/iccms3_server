import { Module } from '@nestjs/common';

import { OrgFindService } from './org-find.service';

@Module({
  exports: [OrgFindService],
  providers: [OrgFindService],
})
export class OrgFindModule {}
