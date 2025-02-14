import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { CodeDto } from './code.dto';
import { CodesService } from './codes.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('codes')
export class CodesController {
  constructor(private readonly usersService: CodesService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.usersService.create(codeDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() codeDto: CodeDto) {
    return this.usersService.update(id, codeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
