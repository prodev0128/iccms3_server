import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import normalize from 'normalize-mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  userID: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  genderNo: number;

  @Prop()
  birthday: Date;

  @Prop()
  stampNo: number;

  @Prop()
  depNo: number;

  @Prop()
  jobNo: number;

  @Prop()
  isActive: boolean;

  @Prop()
  roles: Array<string>;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(normalize);

export { UserSchema };
