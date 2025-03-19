import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { FileDto } from './dto/file.dto';
import { FilesService } from './files.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiQuery({ description: 'ids', name: 'ids' })
  findFiles(@Query('ids') idsText: string) {
    return this.filesService.findFiles(idsText);
  }

  @Post()
  createFile(@Body() fileDto: FileDto) {
    return this.filesService.createFile(fileDto);
  }

  @Put(':id')
  updateFile(@Param('id') id: string, @Body() fileDto: FileDto) {
    return this.filesService.updateFile(id, fileDto);
  }

  @Delete(':id')
  removeFile(@Param('id') id: string) {
    return this.filesService.removeFile(id);
  }
}
