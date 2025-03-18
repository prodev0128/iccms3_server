import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import normalize from 'normalize-mongoose';

export type NewsDocument = News & Document;

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop()
  viewCount: number;
}

const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.plugin(normalize);

export { NewsSchema };
