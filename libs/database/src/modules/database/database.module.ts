import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema'; // Import User schema

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema
  ],
  exports: [MongooseModule], // Export MongooseModule for use in other apps
})
export class DatabaseModule {}
