import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CodeDocument = Code & Document;

@Schema({ timestamps: true })
export class Code {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  isActive: boolean;

  @Prop()
  options: Array<object>;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
