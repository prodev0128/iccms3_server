import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';
import { User } from '@app/user';

import { InvoiceDto } from './dto/invoice.dto';
import { UpdateInvoicesStatusDto } from './dto/update-invoice-status.dto';
import { InvoicesService } from './invoices.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiQuery({ description: 'dep', name: 'dep' })
  @ApiQuery({ description: 'status', name: 'status' })
  @ApiQuery({ description: 'fileType', name: 'fileType' })
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'pageSize', name: 'pageSize' })
  @ApiQuery({ description: 'filterModel', name: 'filterModel' })
  @ApiQuery({ description: 'sortModel', name: 'sortModel' })
  findInvoices(
    @User() user: any,
    @Query('dep') dep = true,
    @Query('status') status = '',
    @Query('fileType') fileType = '',
    @Query('page') page = 0,
    @Query('pageSize') pageSize = 10,
    @Query('filterModel') filterModel?: string,
    @Query('sortModel') sortModel?: string,
  ) {
    return this.invoicesService.findInvoices(user, dep, status, fileType, page, pageSize, filterModel, sortModel);
  }

  @Post()
  createInvoice(@Body() invoiceDto: InvoiceDto) {
    return this.invoicesService.createInvoice(invoiceDto);
  }

  @Put(':id')
  updateInvoice(@Param('id') id: string, @Body() invoiceDto: InvoiceDto) {
    return this.invoicesService.updateInvoice(id, invoiceDto);
  }

  @Patch('status')
  updateInvoicesStatus(@Body() updateDto: UpdateInvoicesStatusDto) {
    return this.invoicesService.updateInvoicesStatus(updateDto);
  }

  @Delete()
  removeInvoice(ids: string[]) {
    return this.invoicesService.removeInvoices(ids);
  }
}
