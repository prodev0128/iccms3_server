import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { NewsDto } from './dto/news.dto';
import { NewsService } from './news.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findNews() {
    return this.newsService.findNews();
  }

  @Post()
  createNews(@Body() newsDto: NewsDto) {
    return this.newsService.createNews(newsDto);
  }

  @Put(':id')
  updateNews(@Param('id') id: string, @Body() newsDto: NewsDto) {
    return this.newsService.updateNews(id, newsDto);
  }

  @Delete(':id')
  removeNews(@Param('id') id: string) {
    return this.newsService.removeNews(id);
  }
}
