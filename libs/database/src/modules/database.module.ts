import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { config } from '@app/config';
import { File, FileSchema } from '@app/database/schemas/file.schema';
import { Invoice, InvoiceSchema } from '@app/database/schemas/invoice.schema';
import { User, UserSchema } from '@app/database/schemas/user.schema';

@Global()
@Module({
  exports: [MongooseModule], // Export MongooseModule for use in other apps
  imports: [
    MongooseModule.forRoot(config.mongodb.uri),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
})
export class DatabaseModule {}
