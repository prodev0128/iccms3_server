import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { CodeDto } from './code.dto';
import { CodeOptionDto } from './codeoption.dto';
import { CodesService } from './codes.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('codeoptions')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Get()
  @ApiQuery({ description: 'Search text', name: 'text', required: false })
  findAllCodeOptions(@Query('text') searchText?: string) {
    return this.codesService.findAllCodeOptions(searchText);
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

  @Get(':codeOptionId/codes')
  findAllCodes() {
    return this.codesService.findAllCodes();
  }

  @Get(':codeOptionId/codes/:id')
  findOneCode(@Param('id') id: string) {
    return this.codesService.findOneCode(id);
  }

  @Post(':codeOptionId/codes')
  createCode(@Body() codeDto: CodeDto) {
    return this.codesService.createCode(codeDto);
  }

  @Put(':codeOptionId/codes/:id')
  updateCode(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.codesService.updateCode(id, codeDto);
  }

  @Patch(':codeOptionId/codes/:id')
  updateCodePartial(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.codesService.updateCodePartial(id, codeDto);
  }

  @Delete(':codeOptionId/codes/:id')
  removeCode(@Param('id') id: string) {
    return this.codesService.removeCode(id);
  }
}
