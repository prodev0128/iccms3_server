import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import normalize from 'normalize-mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dataType: string;

  @Prop({ required: true })
  fileType: string;

  @Prop()
  org: string;

  @Prop()
  status: string;

  @Prop({
    type: [
      {
        action: { type: String, required: true },
        at: { type: Date, required: true, default: Date.now },
        by: { type: String, required: true },
      },
    ],
    default: [],
    required: true,
  })
  events: { type: string; at: Date; by: string; work: boolean }[];

  @Prop()
  dep: string;

  @Prop()
  censor: string;

  @Prop()
  checker: string;

  @Prop({ default: 0 })
  progress: number;
}

const InvoiceSchema = SchemaFactory.createForClass(Invoice);

InvoiceSchema.plugin(normalize);

export { InvoiceSchema };
