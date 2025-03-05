import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { CodeOptionDto } from '../dto/code-option.dto';
import { CodeOptionsService } from './code-options.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('codeoptions')
export class CodeOptionsController {
  constructor(private readonly codesService: CodeOptionsService) {}

  @Get()
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'pageSize', name: 'pageSize' })
  @ApiQuery({ description: 'filterModel', name: 'filterModel' })
  @ApiQuery({ description: 'sortModel', name: 'sortModel' })
  findCodeOptions(
    @Query('page') page = 0,
    @Query('pageSize') pageSize = 10,
    @Query('filterModel') filterModel: string,
    @Query('sortModel') sortModel: string,
  ) {
    return this.codesService.findCodeOptions(page, pageSize, filterModel, sortModel);
  }

  @Post()
  createCodeOption(@Body() codeOptionDto: CodeOptionDto) {
    return this.codesService.createCodeOption(codeOptionDto);
  }

  @Put(':id')
  updateCodeOption(@Param('id') id: string, @Body() codeOptionDto: CodeOptionDto) {
    return this.codesService.updateCodeOption(id, codeOptionDto);
  }

  @Delete(':id')
  removeCodeOption(@Param('id') id: string) {
    return this.codesService.removeCodeOption(id);
  }
}
