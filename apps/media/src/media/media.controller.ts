import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { JwtAuthGuard } from '@app/jwt';

import { MediaService } from './media.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiQuery({ description: 'file name', name: 'fileName' })
  getFile(@Query('fileName') fileName: string, @Res() res: Response, @Req() req: Request) {
    return this.mediaService.getFile(fileName, res, req);
  }
}
