import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  orgID: Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
