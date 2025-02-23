import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import normalize from 'normalize-mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop()
  name: string;

  @Prop({ ref: 'Organization', type: Types.ObjectId })
  orgID: Types.ObjectId;
}

const InvoiceSchema = SchemaFactory.createForClass(Invoice);

InvoiceSchema.plugin(normalize);

export { InvoiceSchema };
