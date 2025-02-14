import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CodeOptionDocument = CodeOption & Document;

@Schema({ timestamps: true })
export class CodeOption {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;
}

export const CodeOptionSchema = SchemaFactory.createForClass(CodeOption);
