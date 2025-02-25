import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { CodeDto } from '../dto/code.dto';
import { CodesService } from './codes.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('codes')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Get(':codeOptionID')
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'pageSize', name: 'pageSize' })
  @ApiQuery({ description: 'filterModel', name: 'filterModel' })
  @ApiQuery({ description: 'sortModel', name: 'sortModel' })
  findCodes(
    @Param('codeOptionID') codeOptionID: string,
    @Query('page') page = 0,
    @Query('pageSize') pageSize = 10,
    @Query('filterModel') filterModel: string,
    @Query('sortModel') sortModel: string,
  ) {
    return this.codesService.findCodes(codeOptionID, page, pageSize, filterModel, sortModel);
  }

  @Get(':id')
  findCode(@Param('id') id: string) {
    return this.codesService.findCode(id);
  }

  @Post('')
  createCode(@Body() codeDto: CodeDto) {
    return this.codesService.createCode(codeDto);
  }

  @Put(':id')
  updateCode(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.codesService.updateCode(id, codeDto);
  }

  @Delete(':id')
  removeCode(@Param('id') id: string) {
    return this.codesService.removeCode(id);
  }
}
