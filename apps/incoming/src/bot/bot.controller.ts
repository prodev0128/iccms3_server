import { Controller, Post } from '@nestjs/common';

import { BotService } from './bot.service';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('refresh')
  check() {
    this.botService.check();
  }
}
