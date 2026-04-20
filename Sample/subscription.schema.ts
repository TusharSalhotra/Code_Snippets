import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  purchasedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  purchasedFor?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  upgradedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan', required: true })
  planId: Types.ObjectId;

  @Prop({ required: true })
  stripeSubscriptionId: string;

  @Prop()
  stripePaymentIntentId?: string;

  @Prop()
  amountPaid?: number;

  @Prop({ default: 'usd' })
  currency?: string;

  @Prop({
    enum: ['succeeded', 'failed', 'pending', 'paid'],
    default: 'pending',
  })
  paymentStatus?: string;

  @Prop()
stripeInvoiceId?: string;

  @Prop({ type: Types.ObjectId, ref: 'Coupon' })
  couponId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  coachId?: Types.ObjectId;

  @Prop()
  stripeCouponId?: string;

  @Prop({ default: 0 })
  discountAmount?: number;



  @Prop({ type: Object })
  paymentMeta?: any;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    enum: ['active', 'past_due', 'expired', 'canceled'],
    default: 'active',
  })
  status: string;

  @Prop()
  canceledAt?: Date;

  // Tracks remaining appointment usage per type for the current period
  @Prop({
    type: [
      {
        appointmentTypeId: { type: Types.ObjectId, ref: 'AppointmentType', required: true },
        remaining: { type: Number, required: true, min: 0 },
        limit: { type: Number, required: true, min: 0 },
      },
    ],
    default: [],
  })
  appointmentAllowances?: Array<{
    appointmentTypeId: Types.ObjectId;
    remaining: number;
    limit: number;
  }>;
}

export type SubscriptionDocument = Subscription & Document;


export const SubscriptionSchema =
  SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index(
  { userId: 1, planId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'active', 'past_due'] },
    },
  },
);


  // for history tracking