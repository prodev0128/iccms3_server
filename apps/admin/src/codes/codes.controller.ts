import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { CodeDto } from './code.dto';
import { CodesService } from './codes.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('codeoptions')
export class CodesController {
  constructor(private readonly codesService: CodesService) {}

  @Get()
  findAllCodeOptions() {
    return this.codesService.findAllCodeOptions();
  }

  @Get(':id')
  findOneCodeOption(@Param('id') id: string) {
    return this.codesService.findOneCodeOption(id);
  }

  @Post()
  createCodeOption(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.codesService.createCodeOption(codeDto);
  }

  @Put(':id')
  updateCodeOption(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.codesService.updateCodeOption(id, codeDto);
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
  createCode(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.codesService.createCode(codeDto);
  }

  @Put(':codeOptionId/codes/:id')
  updateCode(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.codesService.updateCode(id, codeDto);
  }

  @Delete(':codeOptionId/codes/:id')
  removeCode(@Param('id') id: string) {
    return this.codesService.removeCode(id);
  }
}
