import { Module } from '@nestjs/common';

import { InvoiceCheckService } from './invoice-check.service';

@Module({
  exports: [InvoiceCheckService],
  providers: [InvoiceCheckService],
})
export class InvoiceCheckModule {}
