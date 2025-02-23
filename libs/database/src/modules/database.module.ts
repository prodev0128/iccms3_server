import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { config } from '@app/config';
import { Code, CodeSchema } from '@app/database/schemas/code.schema';
import { CodeOption, CodeOptionSchema } from '@app/database/schemas/codeoption.schema';
import { File, FileSchema } from '@app/database/schemas/file.schema';
import { Invoice, InvoiceSchema } from '@app/database/schemas/invoice.schema';
import { User, UserSchema } from '@app/database/schemas/user.schema';

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
    ]),
  ],
  exports: [MongooseModule], // Export MongooseModule for use in other apps
})
export class DatabaseModule {}
