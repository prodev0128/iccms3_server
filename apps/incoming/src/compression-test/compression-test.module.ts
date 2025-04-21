import { Module } from '@nestjs/common';

import { CompressionTestService } from './compression-test.service';

@Module({
  exports: [CompressionTestService],
  providers: [CompressionTestService],
})
export class CompressionTestModule {}
