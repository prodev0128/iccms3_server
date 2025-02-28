import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import normalize from 'normalize-mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop()
  org: string;

  @Prop({ type: Types.ObjectId, ref: 'Invoice' })
  invoiceID: Types.ObjectId;

  @Prop()
  cenFlag: string;

  @Prop()
  censoredBy: string;

  @Prop()
  censoredAt: string;
}

const FileSchema = SchemaFactory.createForClass(File);

FileSchema.plugin(normalize);

export { FileSchema };
