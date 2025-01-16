import { Module } from '@nestjs/common';

import { IncomingModule } from './incoming/incoming.module';

@Module({
  imports: [IncomingModule],
})
export class MainModule {}
