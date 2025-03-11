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

  @Get()
  @ApiQuery({ description: 'types', name: 'types' })
  findCodesByType(@Query('types') typeText: string) {
    return this.codesService.findCodesByType(typeText);
  }

  @Get(':type')
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'pageSize', name: 'pageSize' })
  @ApiQuery({ description: 'filterModel', name: 'filterModel' })
  @ApiQuery({ description: 'sortModel', name: 'sortModel' })
  findCodes(
    @Param('type') type: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('filterModel') filterModel: string,
    @Query('sortModel') sortModel: string,
  ) {
    return this.codesService.findCodes(type, page, pageSize, filterModel, sortModel);
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
