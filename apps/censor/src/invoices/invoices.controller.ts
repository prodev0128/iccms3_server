import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { User } from '@app/user';

import { EventDto } from './dto/event.dto';
import { InvoiceDto } from './dto/invoice.dto';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'pageSize', name: 'pageSize' })
  @ApiQuery({ description: 'filterModel', name: 'filterModel' })
  @ApiQuery({ description: 'sortModel', name: 'sortModel' })
  findInvoices(
    @User() user: any,
    @Query('status') status = '',
    @Query('fileType') fileType = '',
    @Query('page') page = 0,
    @Query('pageSize') pageSize = 10,
    @Query('filterModel') filterModel: string,
    @Query('sortModel') sortModel: string,
  ) {
    return this.invoicesService.findInvoices(user, status, fileType, page, pageSize, filterModel, sortModel);
  }

  @Post()
  createInvoice(@Body() invoiceDto: InvoiceDto) {
    return this.invoicesService.createInvoice(invoiceDto);
  }

  @Put(':id')
  updateInvoice(@Param('id') id: string, @Body() invoiceDto: InvoiceDto) {
    return this.invoicesService.updateInvoice(id, invoiceDto);
  }

  @Put('status')
  updateInvoicesStatus(@Body() ids: string[], @Body() event: EventDto) {
    return this.invoicesService.updateInvoicesStatus(ids, event);
  }

  @Delete()
  removeInvoice(ids: string[]) {
    return this.invoicesService.removeInvoices(ids);
  }
}
