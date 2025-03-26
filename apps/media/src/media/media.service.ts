import { Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';

import { config } from '@app/globals/config';

@Injectable()
export class MediaService {
  getFile(fileName: string, res: Response, _: Request) {
    const filePath = path.join(config.env.watchDirectory, 'ftp', config.env.progress.registering, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    const stream = fs.createReadStream(filePath);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `inline; filename="${fileName}"`,
    });

    stream.pipe(res);
  }
}
