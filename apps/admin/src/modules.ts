import { Module } from '@nestjs/common';

import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [AdminModule],
})
export class MainModule {}
