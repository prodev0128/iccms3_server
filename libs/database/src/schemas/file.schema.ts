import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  orgID: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
