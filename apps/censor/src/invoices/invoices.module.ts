import { Module } from '@nestjs/common';

import { FilesService } from '../files/files.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [],
  controllers: [InvoicesController],
  providers: [InvoicesService, FilesService],
})
export class InvoicesModule {}
