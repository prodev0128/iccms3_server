import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';
import { Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop()
  name: string;

  @Prop({ ref: 'Organization', type: Types.ObjectId })
  orgID: Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
