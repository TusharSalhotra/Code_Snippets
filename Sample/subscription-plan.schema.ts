import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SubscriptionPlan {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['monthly', 'yearly'], required: true })
  interval: 'monthly' | 'yearly';

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'usd' })
  currency: string;

  @Prop([{ type: Types.ObjectId, ref: 'Course' }])
  includedCourses: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Bundle' }])
  includedBundles: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'Assessment' }])
  includedAssessments: Types.ObjectId[];

  // Statement fields for courses, bundles, and assessments
  @Prop({
    type: [{}],
    default: [],
  })
  courseStatement?: Array<any>;

  @Prop({
    type: [{}],
    default: [],
  })
  bundleStatement?: Array<any>;

  @Prop({
    type: [{}],
    default: [],
  })
  assessmentStatement?: Array<any>;

  // Appointment packages included in this plan
  @Prop([{ type: Types.ObjectId, ref: 'AppointmentPackage' }])
  includedAppointmentPackages: Types.ObjectId[];

  @Prop({
    type: [{}],
    default: [],
  })
  appointmentPackageStatement?: Array<any>;

  // Allow including appointment quotas per plan
  // Each item ties to an AppointmentType and a usage limit (e.g., 3 per period)
  @Prop({
    type: [
      {
        appointmentTypeId: { type: Types.ObjectId, ref: 'AppointmentType', required: true },
        limit: { type: Number, required: true, min: 1 },
      },
    ],
    default: [],
  })
  includedAppointments?: Array<{
    appointmentTypeId: Types.ObjectId;
    limit: number;
  }>;

  @Prop({ unique: true, sparse: true })
  stripeProductId: string;

  @Prop()
  stripePriceId: string;

  @Prop({ type: String })
  userType?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: false })
  isAiCoachIncluded: boolean;

  @Prop()
  aiCoachStatement?: string;

  @Prop()
  aiCoachCopilotStatement?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  // Used for idempotency / deduplication of Redis retry requests
  @Prop({ type: String, index: true })
  _requestId?: string;

}

export type SubscriptionPlanDocument = SubscriptionPlan & Document;

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
