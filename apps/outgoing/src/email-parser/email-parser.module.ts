import { Module } from '@nestjs/common';

import { EmailParserService } from './email-parser.service';

@Module({
  exports: [EmailParserService],
  providers: [EmailParserService],
})
export class EmailParserModule {}
