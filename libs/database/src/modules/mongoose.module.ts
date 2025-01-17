import { config } from '@app/config';
import { User, UserSchema } from '@app/database/schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongodb.uri),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [MongooseModule], // Export MongooseModule for use in other apps
})
export class DatabaseModule {}
