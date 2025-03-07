import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import normalize from 'normalize-mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  value: any;
}

const SettingSchema = SchemaFactory.createForClass(Setting);

SettingSchema.plugin(normalize);

export { SettingSchema };
