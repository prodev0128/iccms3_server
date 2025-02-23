import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import normalize from 'normalize-mongoose';

export type CodeOptionDocument = CodeOption & Document;

@Schema({ timestamps: true })
export class CodeOption {
  @Prop({ required: true, unique: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  isActive: boolean;

  @Prop()
  options: Array<object>;
}

const CodeOptionSchema = SchemaFactory.createForClass(CodeOption);

CodeOptionSchema.plugin(normalize);

export { CodeOptionSchema };
