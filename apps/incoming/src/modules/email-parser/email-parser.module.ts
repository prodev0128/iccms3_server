import { Module } from '@nestjs/common';

import { EmailParserService } from './email-parser.service';

@Module({
  providers: [EmailParserService],
  exports: [EmailParserService],
})
export class EmailParserModule {}
