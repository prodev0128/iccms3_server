import { Controller, Get } from '@nestjs/common';

import { FtpIncomingService } from './ftp-incoming.service';

@Controller()
export class FtpIncomingController {
  constructor(private readonly incomingService: FtpIncomingService) {}

  @Get()
  getHello(): string {
    return this.incomingService.getHello();
  }
}
