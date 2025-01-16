import { Controller, Get } from '@nestjs/common';
import { IncomingService } from './incoming.service';

@Controller()
export class IncomingController {
  constructor(private readonly incomingService: IncomingService) {}

  @Get()
  getHello(): string {
    return this.incomingService.getHello();
  }
}
