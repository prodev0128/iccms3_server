import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import normalize from 'normalize-mongoose';

export type CodeDocument = Code & Document;

@Schema({ timestamps: true })
export class Code {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: Object, default: () => ({}) })
  options!: Record<string, any>;
}

const CodeSchema = SchemaFactory.createForClass(Code);

CodeSchema.plugin(normalize);

export { CodeSchema };
