import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { config } from '@app/globals/config';

import { Code, CodeSchema } from '../schemas/code.schema';
import { CodeOption, CodeOptionSchema } from '../schemas/code-option.schema';
import { File, FileSchema } from '../schemas/file.schema';
import { Invoice, InvoiceSchema } from '../schemas/invoice.schema';
import { News, NewsSchema } from '../schemas/news.schema';
import { Setting, SettingSchema } from '../schemas/setting.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(config.mongodb.uri),
    MongooseModule.forFeature([
      { name: Code.name, schema: CodeSchema },
      { name: CodeOption.name, schema: CodeOptionSchema },
      { name: File.name, schema: FileSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: News.name, schema: NewsSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [MongooseModule], // Export MongooseModule for use in other apps
})
export class DatabaseModule {}
