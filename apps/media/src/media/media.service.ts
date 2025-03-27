import { Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import fs from 'fs-extra';
import mime from 'mime';
import path from 'path';

import { config } from '@app/globals/config';

@Injectable()
export class MediaService {
  async getFile(fileName: string, res: Response, _: Request) {
    const filePath = path.join(config.env.watchDirectory, 'ftp', config.env.progress.registering, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const stream = fs.createReadStream(filePath);
    const mimeType = mime.getType(filePath);

    res.set({
      'Content-Type': mimeType ? mimeType : 'application/octet-stream',
      'Content-Disposition': `inline; filename="${fileName}"`,
    });

    stream.pipe(res);
  }
}
