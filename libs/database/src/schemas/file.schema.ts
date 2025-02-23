import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import normalize from 'normalize-mongoose';

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

const FileSchema = SchemaFactory.createForClass(File);

FileSchema.plugin(normalize);

export { FileSchema };
