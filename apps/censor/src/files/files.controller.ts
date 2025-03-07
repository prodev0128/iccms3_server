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
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'pageSize', name: 'pageSize' })
  @ApiQuery({ description: 'filterModel', name: 'filterModel' })
  @ApiQuery({ description: 'sortModel', name: 'sortModel' })
  findFiles(
    @Query('page') page = 0,
    @Query('pageSize') pageSize = 10,
    @Query('filterModel') filterModel: string,
    @Query('sortModel') sortModel: string,
  ) {
    return this.filesService.findFiles(page, pageSize, filterModel, sortModel);
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
