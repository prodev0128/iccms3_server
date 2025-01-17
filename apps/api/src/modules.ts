import { Module } from '@nestjs/common';

import { AppModule } from './modules/app/app.module';

@Module({
  imports: [AppModule],
})
export class MainModule {}
