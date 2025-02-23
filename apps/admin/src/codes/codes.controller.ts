import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { CodesService } from './codes.service';
import { CodeDto } from './dto/code.dto';
import { CodeOptionDto } from './dto/codeoption.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('codeoptions')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

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

  @Get(':id')
  findOneCodeOption(@Param('id') id: string) {
    return this.codesService.findOneCodeOption(id);
  }

  @Post()
  createCodeOption(@Body() codeOptionDto: CodeOptionDto) {
    return this.codesService.createCodeOption(codeOptionDto);
  }

  @Put(':id')
  updateCodeOption(@Param('id') id: string, @Body() codeOptionDto: CodeOptionDto) {
    return this.codesService.updateCodeOption(id, codeOptionDto);
  }

  @Put(':id')
  updateCodeOptionPartial(@Param('id') id: string, @Body() codeOptionDto: CodeOptionDto) {
    return this.codesService.updateCodeOptionPartial(id, codeOptionDto);
  }

  @Delete(':id')
  removeCodeOption(@Param('id') id: string) {
    return this.codesService.removeCodeOption(id);
  }

  @Get(':codeOptionType/codes')
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'pageSize', name: 'pageSize' })
  @ApiQuery({ description: 'filterModel', name: 'filterModel' })
  @ApiQuery({ description: 'sortModel', name: 'sortModel' })
  findCodes(
    @Param('codeOptionType') codeOptionType: string,
    @Query('page') page = 0,
    @Query('pageSize') pageSize = 10,
    @Query('filterModel') filterModel: string,
    @Query('sortModel') sortModel: string,
  ) {
    return this.codesService.findCodes(codeOptionType, page, pageSize, filterModel, sortModel);
  }

  @Get(':codeOptionType/codes/:id')
  findOneCode(@Param('codeOptionType') codeOptionType: string, @Param('id') id: string) {
    return this.codesService.findOneCode(codeOptionType, id);
  }

  @Post(':codeOptionType/codes')
  createCode(@Param('codeOptionType') codeOptionType: string, @Body() codeDto: CodeDto) {
    return this.codesService.createCode(codeOptionType, codeDto);
  }

  @Put(':codeOptionType/codes/:id')
  updateCode(@Param('codeOptionType') codeOptionType: string, @Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.codesService.updateCode(codeOptionType, id, codeDto);
  }

  @Patch(':codeOptionType/codes/:id')
  updateCodePartial(
    @Param('codeOptionType') codeOptionType: string,
    @Param('id') id: string,
    @Body() codeDto: CodeDto,
  ) {
    return this.codesService.updateCodePartial(codeOptionType, id, codeDto);
  }

  @Delete(':codeOptionType/codes/:id')
  removeCode(@Param('codeOptionType') codeOptionType: string, @Param('id') id: string) {
    return this.codesService.removeCode(codeOptionType, id);
  }
}
