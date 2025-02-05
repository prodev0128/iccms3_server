import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: true })
  orgID: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
