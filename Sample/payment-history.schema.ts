import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { PaymentFor } from '../../enums/Payment';


export type PaymentHistoryDocument = PaymentHistory & Document;

@Schema({ timestamps: true, collection: 'payment_history' })
export class PaymentHistory {
  [x: string]: any | ObjectId;
  
  @Prop({ 
    required: true, 
    enum: PaymentFor, 
    type: String,
    default: PaymentFor.ASSESSMENT 
  })
  paymentFor: PaymentFor;

  @Prop({ required: false, type: Types.ObjectId, ref: 'PurchasedAssessment' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  paidBy: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'PurchasedBundle' })
  purchasedBundleId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment' })
  appointmentId?: Types.ObjectId;
  
  @Prop({ required: false, type: Types.ObjectId, ref: 'PurchasedAssessment' })
  purchasedAssessmentId: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'PurchasedCourse' })
  purchasedCourseId: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Subscription' })
  subscriptionId?: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Coupon' })
  couponId?: Types.ObjectId;

  @Prop({ auto: true })
  orderId: number;

  @Prop()
  stripePaymentIntentId: string;

  @Prop({})
  amount: number;

  @Prop({ type: Date })
  paymentDate?: Date;
  
  @Prop({ type: Object })
  metaData?: object;

  // Stripe Connect destination charge tracking
  @Prop({ type: Types.ObjectId, ref: 'User' })
  coachId?: Types.ObjectId; // Coach who receives payment

  @Prop()
  coachShareAmount?: number; // Amount transferred to coach

  @Prop()
  platformShareAmount?: number; // Amount retained by platform (HWH)

  @Prop()
  coachSharePercentage?: number; // Commission percentage at time of payment

  @Prop()
  stripeTransferId?: string; // Stripe transfer ID for coach payout

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const PaymentHistorySchema =
  SchemaFactory.createForClass(PaymentHistory);
