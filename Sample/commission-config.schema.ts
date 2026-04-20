import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type CommissionConfigDocument = CommissionConfig & Document;

@Schema({ timestamps: true, collection: 'commission_configs' })
export class CommissionConfig {
  [x: string]: any | ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  coachId?: Types.ObjectId; // If null, this is the global default config

  @Prop({ required: true, min: 0, max: 100, default: 100 })
  coachSharePercentage: number; // e.g., 100 means coach gets 100%

  @Prop({ required: true, min: 0, max: 100, default: 0 })
  platformSharePercentage: number; // e.g., 0 means HWH keeps 0%

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  @Prop({ required: false })
  notes?: string; // Admin notes about this commission configuration
}

export const CommissionConfigSchema = SchemaFactory.createForClass(CommissionConfig);

// Unique index: only one active config per coach (or one global default where coachId is null)
CommissionConfigSchema.index(
  { coachId: 1, isActive: 1, isDeleted: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true, isDeleted: false }
  }
);
