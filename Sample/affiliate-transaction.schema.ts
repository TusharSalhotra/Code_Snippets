import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AffiliateTransactionDocument = AffiliateTransaction & Document;

export enum AffiliateTransactionType {
  SUBSCRIPTION_INITIAL = 'subscription_initial', // First subscription payment
  SUBSCRIPTION_RECURRING = 'subscription_recurring', // Recurring subscription payment
  PACKAGE_PURCHASE = 'package_purchase', // Appointment package purchase
  DIRECT_APPOINTMENT = 'direct_appointment', // Direct paid appointment
}

export enum AffiliateTransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Sub-schema for Platform View breakdown
class PlatformBreakdown {
  @Prop({ required: true })
  paymentAmount: number; // Gross amount (e.g., 99.00)

  @Prop({ required: true })
  stripeProcessingFee: number; // Stripe processing fee (e.g., 3.47)

  @Prop({ required: true })
  netAmount: number; // After Stripe fee (e.g., 95.53)

  @Prop({ required: true })
  collectedFee: number; // Platform's share / Application fee (e.g., 51.08)

  @Prop({ required: true, default: 'eur' })
  currency: string; // Currency (e.g., 'eur')
}

// Sub-schema for Coach View breakdown
class CoachBreakdown {
  @Prop({ required: true })
  grossAmountOriginal: number; // Original currency amount (e.g., 99.00 EUR)

  @Prop({ required: true, default: 'eur' })
  originalCurrency: string; // Original currency (e.g., 'eur')

  @Prop()
  grossAmountConverted?: number; // Converted amount if different currency (e.g., 118.03 USD)

  @Prop()
  convertedCurrency?: string; // Converted currency (e.g., 'usd')

  @Prop()
  exchangeRate?: number; // Exchange rate used (e.g., 1.1922)

  @Prop({ required: true })
  totalFees: number; // Total fees deducted from coach (e.g., 63.26)

  @Prop({ required: true })
  netAmount: number; // Coach's net amount after all fees (e.g., 54.77)

  @Prop({ required: true })
  netCurrency: string; // Currency of net amount (e.g., 'usd')

  // Fee breakdown
  @Prop()
  applicationFee?: number; // Platform application fee in coach's currency

  @Prop()
  stripeConnectFee?: number; // Stripe Connect processing fee
}

// Sub-schema for Split Calculation details
class SplitCalculation {
  @Prop({ required: true })
  coachPercentage: number; // Coach's percentage share (e.g., 50)

  @Prop({ required: true })
  platformPercentage: number; // Platform's percentage share (e.g., 50)

  @Prop({ required: true })
  grossAmount: number; // Original payment amount

  @Prop({ required: true })
  stripeProcessingFee: number; // Stripe processing fee

  @Prop({ required: true })
  netAfterStripeFee: number; // Amount after Stripe fee (base for split)

  @Prop({ required: true })
  coachShareOfNet: number; // Coach's share of net amount

  @Prop({ required: true })
  platformShareOfNet: number; // Platform's share of net amount

  @Prop()
  applicationFeePercent?: number; // Adjusted application fee percent used in Stripe
}

@Schema({ timestamps: true, collection: 'affiliate_transactions' })
export class AffiliateTransaction {
  // ===== TRANSACTION TYPE & STATUS =====

  @Prop({
    required: true,
    enum: AffiliateTransactionType,
    type: String,
  })
  transactionType: AffiliateTransactionType;

  @Prop({
    required: true,
    enum: AffiliateTransactionStatus,
    type: String,
    default: AffiliateTransactionStatus.PENDING,
  })
  status: AffiliateTransactionStatus;

  // ===== PARTICIPANTS =====

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  clientId: Types.ObjectId; // User who made the payment

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  coachId: Types.ObjectId; // Coach who receives the share

  @Prop({ required: true, type: Types.ObjectId, ref: 'Affiliate' })
  affiliateId: Types.ObjectId; // Reference to affiliate record

  // ===== RELATED ENTITIES =====

  @Prop({ type: Types.ObjectId, ref: 'Subscription' })
  subscriptionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PurchasedAppointmentPackage' })
  purchasedPackageId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Appointment' })
  appointmentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SubscriptionPlan' })
  subscriptionPlanId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'AppointmentPackage' })
  appointmentPackageId?: Types.ObjectId;

  // ===== PLATFORM VIEW BREAKDOWN =====
  // (What you see in Stripe Dashboard - Platform Account)

  @Prop({ type: PlatformBreakdown, required: true })
  platformView: PlatformBreakdown;

  // ===== COACH VIEW BREAKDOWN =====
  // (What coach sees in Stripe Dashboard - Connected Account)

  @Prop({ type: CoachBreakdown, required: true })
  coachView: CoachBreakdown;

  // ===== SPLIT CALCULATION DETAILS =====

  @Prop({ type: SplitCalculation, required: true })
  splitCalculation: SplitCalculation;

  // ===== STRIPE REFERENCES =====

  @Prop()
  stripePaymentIntentId?: string;

  @Prop()
  stripeChargeId?: string;

  @Prop()
  stripeInvoiceId?: string;

  @Prop()
  stripeSubscriptionId?: string;

  @Prop()
  stripeTransferId?: string;

  @Prop({ required: true })
  coachConnectAccountId: string; // Coach's Stripe Connect Account ID

  // ===== DESTINATION CHARGE DETAILS =====

  @Prop({ default: false })
  usedDestinationCharge: boolean; // True if used destination charge (transfer visible on payment page)

  @Prop()
  applicationFeeId?: string; // Stripe Application Fee ID

  // ===== TIMESTAMPS =====

  @Prop({ type: Date, required: true })
  paymentDate: Date;

  @Prop({ type: Date })
  transferDate?: Date; // When transfer was initiated to coach

  // ===== BILLING PERIOD (for recurring subscriptions) =====

  @Prop({ type: Date })
  billingPeriodStart?: Date;

  @Prop({ type: Date })
  billingPeriodEnd?: Date;

  // ===== ERROR TRACKING =====

  @Prop()
  errorMessage?: string;

  @Prop()
  errorCode?: string;

  @Prop({ type: Number, default: 0 })
  retryCount: number;

  // ===== COUPON DETAILS =====

  @Prop({ type: Boolean, default: false })
  couponApplied: boolean; // True if coupon was used for this transaction

  @Prop({ type: Types.ObjectId, ref: 'Coupon' })
  couponId?: Types.ObjectId; // Reference to coupon used

  @Prop()
  couponCode?: string; // Coupon code used (e.g., 'FLAT100')

  @Prop()
  couponDiscountAmount?: number; // Discount amount applied (e.g., 99)

  @Prop({ type: Boolean, default: false })
  noCostTransaction: boolean; // True if 100% discount (no payment required)

  // ===== NOTES & METADATA =====

  @Prop()
  description?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  // ===== RAW STRIPE DATA (for debugging/audit) =====

  @Prop({ type: Object })
  stripeInvoiceData?: Record<string, any>;

  @Prop({ type: Object })
  stripeChargeData?: Record<string, any>;

  // ===== SOFT DELETE =====

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const AffiliateTransactionSchema = SchemaFactory.createForClass(AffiliateTransaction);

// Indexes for efficient queries
AffiliateTransactionSchema.index({ clientId: 1, createdAt: -1 });
AffiliateTransactionSchema.index({ coachId: 1, createdAt: -1 });
AffiliateTransactionSchema.index({ affiliateId: 1, createdAt: -1 });
AffiliateTransactionSchema.index({ subscriptionId: 1 });
AffiliateTransactionSchema.index({ transactionType: 1, status: 1 });
AffiliateTransactionSchema.index({ stripeSubscriptionId: 1 });
AffiliateTransactionSchema.index({ stripeTransferId: 1 });
AffiliateTransactionSchema.index({ stripeChargeId: 1 });
AffiliateTransactionSchema.index({ paymentDate: -1 });
