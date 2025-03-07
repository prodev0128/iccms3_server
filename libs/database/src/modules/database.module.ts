import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Code, CodeSchema } from '@app/database/schemas/code.schema';
import { CodeOption, CodeOptionSchema } from '@app/database/schemas/code-option.schema';
import { File, FileSchema } from '@app/database/schemas/file.schema';
import { Invoice, InvoiceSchema } from '@app/database/schemas/invoice.schema';
import { Setting, SettingSchema } from '@app/database/schemas/setting.schema';
import { User, UserSchema } from '@app/database/schemas/user.schema';
import { config } from '@app/globals/config';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(config.mongodb.uri),
    MongooseModule.forFeature([
      { name: Code.name, schema: CodeSchema },
      { name: CodeOption.name, schema: CodeOptionSchema },
      { name: File.name, schema: FileSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: User.name, schema: UserSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
  ],
  exports: [MongooseModule], // Export MongooseModule for use in other apps
})
export class DatabaseModule {}
