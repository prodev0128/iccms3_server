import { Module } from '@nestjs/common';

import { InvoicesService } from '../invoices/invoices.service';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService, InvoicesService],
})
export class FilesModule {}
