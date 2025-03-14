import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { DataTypes, FindCategory, initialPaginationModel, InvoiceStatus } from '@app/globals/constants';
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
  @ApiQuery({ description: 'category', name: 'category' })
  @ApiQuery({ description: 'status', name: 'status' })
  @ApiQuery({ description: 'data type', name: 'dataType' })
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'page size', name: 'pageSize' })
  @ApiQuery({ description: 'filter model', name: 'filterModel' })
  @ApiQuery({ description: 'sort model', name: 'sortModel' })
  findInvoices(
    @User() user: any,
    @Query('category') category = FindCategory.ALL,
    @Query('minStatus') minStatus = InvoiceStatus.UNDEFINED,
    @Query('maxStatus') maxStatus = InvoiceStatus.COMPLETED,
    @Query('dataType') dataType = DataTypes.ALL,
    @Query('page') page = initialPaginationModel.page,
    @Query('pageSize') pageSize = initialPaginationModel.pageSize,
    @Query('filterModel') filterModel?: string,
    @Query('sortModel') sortModel?: string,
  ) {
    return this.invoicesService.findInvoices(
      user,
      category,
      minStatus,
      maxStatus,
      dataType,
      page,
      pageSize,
      filterModel,
      sortModel,
    );
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
