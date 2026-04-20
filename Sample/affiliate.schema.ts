import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AffiliateDocument = Affiliate & Document;

@Schema({ timestamps: true })
export class Affiliate {
  @Prop({ type: String, required: true })
  coachId: string;

  @Prop({ required: true, min: 0, max: 100 })
  coachPercentage: number;

  @Prop({ required: true })
  affiliateLink: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export const AffiliateSchema = SchemaFactory.createForClass(Affiliate);