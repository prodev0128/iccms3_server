import { Module } from '@nestjs/common';
import { IncomingController } from './incoming.controller';
import { IncomingService } from './incoming.service';

@Module({
  imports: [],
  controllers: [IncomingController],
  providers: [IncomingService],
})
export class IncomingModule {}
