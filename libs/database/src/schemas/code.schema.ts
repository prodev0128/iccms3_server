import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import normalize from 'normalize-mongoose';

export type CodeDocument = Code & Document;

@Schema({ timestamps: true })
export class Code {
  @Prop({ required: true, type: Types.ObjectId, ref: 'CodeOption' })
  optionID: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  value: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  options: Array<object>;
}

const CodeSchema = SchemaFactory.createForClass(Code);

CodeSchema.plugin(normalize);

export { CodeSchema };
