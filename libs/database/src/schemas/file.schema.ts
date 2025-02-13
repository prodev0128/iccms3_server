import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ ref: 'Organization', type: Types.ObjectId })
  orgID: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
