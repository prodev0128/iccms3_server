import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EmailParserService } from './email-parser.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [EmailParserService],
  exports: [EmailParserService],
})
export class EmailParserModule {}
