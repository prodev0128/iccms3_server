import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { SeederService } from './seeder.service';

@Module({
  imports: [DatabaseModule],
  providers: [SeederService],
})
export class SeederModule {}
