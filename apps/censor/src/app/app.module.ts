import { Module } from '@nestjs/common';

import { config } from '@app/config';
import { DatabaseModule } from '@app/database';
import { JwtModule } from '@app/jwt';
import { LoggerModule } from '@app/logger';
import { SetupModule } from '@app/setup';

import { AppController } from '../../../admin/src/app/app.controller';
import { AppService } from '../../../admin/src/app/app.service';
import { FilesModule } from '../files/files.module';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule,
    LoggerModule.forRoot(config.censor.name),
    SetupModule,
    FilesModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
