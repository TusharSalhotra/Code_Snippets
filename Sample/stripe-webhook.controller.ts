import {
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { StripeService } from '../../../libs/common/src/payment/stripe.service';
import { Affiliate } from '../../../libs/common/src/db/schemas/affiliate.schema';
import { User } from '../../../libs/common/src/db/schemas/user.schema';
import { Subscription } from '../../../libs/common/src/db/schemas/subscription.schema';
import { PurchasedCourse } from '../../../libs/common/src/db/schemas/purchased-course.schema';
import { PurchaseBundle } from '../../../libs/common/src/db/schemas/purchase-bundle.schema';
import { UserAssessment } from '../../../libs/common/src/db/schemas/user-assessment.schema';
import { SubscriptionPlan } from '../../../libs/common/src/db/schemas/subscription-plan.schema';
import { AffiliateTransaction, AffiliateTransactionType, AffiliateTransactionStatus } from '../../../libs/common/src/db/schemas/affiliate-transaction.schema';
import { Common, ErrorMessages } from '@app/common';

@Controller('stripe/webhook')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeService,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,

    @InjectModel(SubscriptionPlan.name)
    private readonly planModel: Model<SubscriptionPlan>,

    @InjectModel(PurchasedCourse.name)
    private readonly purchasedCourse: Model<PurchasedCourse>,

    @InjectModel(PurchaseBundle.name)
    private readonly purchasedBundle: Model<PurchaseBundle>,

    @InjectModel(UserAssessment.name)
    private readonly userAssessmentModel: Model<UserAssessment>,

    @InjectModel(Affiliate.name)
    private readonly affiliateModel: Model<Affiliate>,

    @InjectModel(AffiliateTransaction.name)
    private readonly affiliateTransactionModel: Model<AffiliateTransaction>,
  ) {
    console.log('Stripe webhook controller initialized');
  }

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      console.log(' Body type:', typeof req.body, 'Is Buffer:', Buffer.isBuffer(req.body));
      console.log(' RawBody type:', typeof req.rawBody, 'Is Buffer:', Buffer.isBuffer(req.rawBody));

      const stripe = this.stripeService.getClient();
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.STRIPE_WEBHOOK_SECRET_NOT_SET);
      }

      console.log('Webhook secret (first 10 chars):', webhookSecret?.substring(0, 10));
      console.log('Signature (first 50 chars):', signature?.substring(0, 50));

      // Use req.body which should be the raw Buffer from bodyParser.raw()
      const payload = req.rawBody || req.body;
      console.log('Using payload type:', typeof payload, 'Is Buffer:', Buffer.isBuffer(payload));
      console.log('Payload length:', payload?.length);
      console.log('Payload preview (first 100 chars):', payload?.toString()?.substring(0, 100));

      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      console.log('Webhook event verified:', event.type);

      const data: any = event.data.object;

      switch (event.type) {
        // ✅ PAYMENT SUCCESS
        case 'invoice.payment_succeeded': {
          console.log('Processing payment success');
          const stripeSubId = data.subscription;

          await this.subscriptionModel.updateOne(
            { stripeSubscriptionId: stripeSubId },
            {
              status: 'active',
              paymentStatus: 'succeeded',
              amountPaid: data.amount_paid / 100,
              currency: data.currency,
              endDate: new Date(data.period_end * 1000),
              paymentMeta: data,
            },
          );

          // Reset appointment allowances for new billing period from plan
          try {
            const sub = await this.subscriptionModel.findOne({ stripeSubscriptionId: stripeSubId });
            if (sub) {
              const plan = await this.planModel.findById(sub.planId).lean();
              if (plan && Array.isArray((plan as any).includedAppointments)) {
                await this.subscriptionModel.updateOne(
                  { _id: sub._id },
                  {
                    $set: {
                      appointmentAllowances: (plan as any).includedAppointments.map((a: any) => ({
                        appointmentTypeId: a.appointmentTypeId,
                        remaining: a.limit,
                        limit: a.limit,
                      })),
                    },
                  },
                );
              }
            }
          } catch (err) {
            console.error('Error resetting appointment allowances:', err);
          }

          await this.userModel.updateOne(
            { stripeCustomerId: data.customer },
            {
              subscriptionStatus: 'active',
              subscriptionEndDate: new Date(data.period_end * 1000),
              isSubscriptionAutoRenew: true,
            },
          );

          // 💰 COACH AFFILIATE PAYMENT SPLIT (for recurring payments)
          try {
            const sub = await this.subscriptionModel.findOne({ stripeSubscriptionId: stripeSubId });
            if (sub && sub.coachId) {
              console.log('Processing coach affiliate payment split for coachId:', sub.coachId);

              // Check if subscription uses destination charges (transfer_data.destination)
              // If so, Stripe automatically handles the split for all payments (initial and recurring)
              const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
              const hasDestinationCharge = !!(stripeSub as any).transfer_data?.destination;

              if (hasDestinationCharge) {
                console.log('Subscription uses DESTINATION CHARGES - Stripe handles transfer automatically:', {
                  destination: (stripeSub as any).transfer_data?.destination,
                  applicationFeePercent: (stripeSub as any).application_fee_percent,
                });

                // 📊 SAVE AFFILIATE TRANSACTION RECORD (for recurring destination charge payments)
                try {
                  const coachIdStr = sub.coachId.toString();
                  const affiliate = await this.affiliateModel.findOne({
                    $or: [
                      { coachId: new Types.ObjectId(coachIdStr) },
                      { coachId: coachIdStr },
                    ],
                    isActive: true,
                    isDeleted: false,
                  });

                  if (affiliate) {
                    const amountPaid = data.amount_paid / 100; // Convert from cents to currency
                    const stripeFeePercent = 2.9;
                    const stripeFixedFee = 0.30;
                    const coachPercentage = affiliate.coachPercentage;
                    const platformPercentage = 100 - coachPercentage;

                    // Calculate breakdown
                    const stripeProcessingFee = (amountPaid * stripeFeePercent / 100) + stripeFixedFee;
                    const netAfterStripeFee = amountPaid - stripeProcessingFee;
                    const coachShareOfNet = netAfterStripeFee * coachPercentage / 100;
                    const platformCollectedFee = amountPaid - coachShareOfNet;
                    const platformShareOfNet = netAfterStripeFee - coachShareOfNet;

                    // Get the plan for more details
                    const plan = sub.planId ? await this.planModel.findById(sub.planId).lean() : null;

                    const affiliateTransactionData = {
                      transactionType: AffiliateTransactionType.SUBSCRIPTION_RECURRING,
                      status: AffiliateTransactionStatus.COMPLETED,
                      clientId: sub.userId,
                      coachId: sub.coachId,
                      affiliateId: affiliate._id,
                      subscriptionId: sub._id,
                      subscriptionPlanId: sub.planId,

                      // Platform View Breakdown
                      platformView: {
                        paymentAmount: amountPaid,
                        stripeProcessingFee: Math.round(stripeProcessingFee * 100) / 100,
                        netAmount: Math.round(netAfterStripeFee * 100) / 100,
                        collectedFee: Math.round(platformCollectedFee * 100) / 100,
                        currency: data.currency || 'eur',
                      },

                      // Coach View Breakdown
                      coachView: {
                        grossAmountOriginal: amountPaid,
                        originalCurrency: data.currency || 'eur',
                        totalFees: Math.round(platformCollectedFee * 100) / 100,
                        netAmount: Math.round(coachShareOfNet * 100) / 100,
                        netCurrency: data.currency || 'eur',
                        applicationFee: Math.round(platformCollectedFee * 100) / 100,
                      },

                      // Split Calculation Details
                      splitCalculation: {
                        coachPercentage,
                        platformPercentage,
                        grossAmount: amountPaid,
                        stripeProcessingFee: Math.round(stripeProcessingFee * 100) / 100,
                        netAfterStripeFee: Math.round(netAfterStripeFee * 100) / 100,
                        coachShareOfNet: Math.round(coachShareOfNet * 100) / 100,
                        platformShareOfNet: Math.round(platformShareOfNet * 100) / 100,
                        applicationFeePercent: (stripeSub as any).application_fee_percent,
                      },

                      // Stripe References
                      stripeChargeId: data.charge,
                      stripeInvoiceId: data.id,
                      stripeSubscriptionId: stripeSubId,
                      coachConnectAccountId: (stripeSub as any).transfer_data?.destination,
                      usedDestinationCharge: true,

                      paymentDate: new Date(),
                      billingPeriodStart: new Date(data.period_start * 1000),
                      billingPeriodEnd: new Date(data.period_end * 1000),

                      description: `Recurring subscription payment - ${(plan as any)?.name || 'Subscription'} - Coach: ${coachPercentage}%`,
                    };

                    await this.affiliateTransactionModel.create(affiliateTransactionData);
                    console.log('Affiliate transaction record saved for recurring payment');
                  }
                } catch (affiliateTransactionError) {
                  console.error('Error saving affiliate transaction record:', affiliateTransactionError);
                }
                // Skip separate transfer - Stripe handles it
              } else {
                console.log('Subscription does NOT use destination charges - processing SEPARATE TRANSFER');

              // Find affiliate record to get coach percentage
              // Query both ObjectId and string formats since data may be stored either way
              const coachIdStr = sub.coachId.toString();
              const affiliate = await this.affiliateModel.findOne({
                $or: [
                  { coachId: new Types.ObjectId(coachIdStr) },
                  { coachId: coachIdStr }, // Also match if stored as string
                ],
                isActive: true,
                isDeleted: false,
              });

              if (affiliate) {
                console.log('Found affiliate record:', {
                  coachId: affiliate.coachId,
                  coachPercentage: affiliate.coachPercentage,
                });

                // Find coach to get their Stripe Connect account ID
                const coach = await this.userModel.findById(sub.coachId).lean();

                if (coach && coach.stripeConnectAccountId && coach.stripeConnectOnboardingComplete) {
                  // Calculate amount after Stripe fee (approximately 2.9% + 30 cents for USD)
                  const amountPaidCents = data.amount_paid; // Already in cents from Stripe
                  const stripeFeePercent = 2.9;
                  const stripeFixedFee = 30; // 30 cents
                  const stripeFee = Math.round((amountPaidCents * stripeFeePercent) / 100) + stripeFixedFee;
                  const amountAfterStripeFee = amountPaidCents - stripeFee;

                  // Calculate coach share based on affiliate percentage
                  const coachShareAmount = Math.round((amountAfterStripeFee * affiliate.coachPercentage) / 100);
                  const platformShareAmount = amountAfterStripeFee - coachShareAmount;

                  // Get the charge ID from the invoice to use as source_transaction
                  // This allows transfer from pending balance (before funds settle)
                  const chargeId = data.charge;

                  console.log('Payment split calculation:', {
                    amountPaidCents,
                    stripeFee,
                    amountAfterStripeFee,
                    coachPercentage: affiliate.coachPercentage,
                    coachShareAmount,
                    platformShareAmount,
                    coachConnectAccountId: coach.stripeConnectAccountId,
                    chargeId,
                  });

                  // Only transfer if coach share is greater than 0
                  if (coachShareAmount > 0) {
                    const transferResult = await this.stripeService.createTransferToCoach(
                      coach.stripeConnectAccountId,
                      coachShareAmount,
                      data.currency || 'eur',
                      `Subscription affiliate share for ${sub._id}`,
                      {
                        subscriptionId: sub._id.toString(),
                        coachId: sub.coachId.toString(),
                        coachPercentage: affiliate.coachPercentage.toString(),
                        amountPaid: amountPaidCents.toString(),
                        stripeFee: stripeFee.toString(),
                      },
                      chargeId, // Pass charge ID as source_transaction for immediate transfer
                    );
                    console.log('Coach payment transfer successful:', transferResult);
                  } else {
                    console.log('Coach share is 0, skipping transfer');
                  }
                } else {
                  console.log('Coach not eligible for payment split:', {
                    coachId: sub.coachId,
                    hasConnectAccountId: !!coach?.stripeConnectAccountId,
                    onboardingComplete: coach?.stripeConnectOnboardingComplete,
                  });
                }
              } else {
                console.log('No active affiliate record found for coach:', sub.coachId);
              }
              } // End of else block for !hasDestinationCharge
            }
          } catch (splitError) {
            // Log error but don't fail the webhook - payment was still successful
            console.error('Error processing coach affiliate payment split:', splitError);
          }

          console.log('Payment success processed');
          break;
        }

        // ❌ PAYMENT FAILED (SOFT LOCK)
        case 'invoice.payment_failed': {
          console.log(' Processing payment failure');
          const stripeSubId = data.subscription;

          await this.subscriptionModel.updateOne(
            { stripeSubscriptionId: stripeSubId },
            { status: 'past_due', paymentStatus: 'failed' },
          );

          await this.userModel.updateOne(
            { stripeCustomerId: data.customer },
            { subscriptionStatus: 'past_due' },
          );
          console.log(' Payment failure processed');
          break;
        }

        // ❌ SUBSCRIPTION EXPIRED / CANCELED (HARD REVOKE)
        case 'customer.subscription.deleted': {
          console.log('Processing subscription deletion');
          const stripeSubId = data.id;

          // 1️⃣ Fetch & expire subscription
          const subscription =
            await this.subscriptionModel.findOneAndUpdate(
              { stripeSubscriptionId: stripeSubId },
              {
                status: 'expired',
                canceledAt: new Date(),
              },
              { new: true },
            );

          if (!subscription) {
            console.log('Subscription not found for deletion');
            break;
          }

          // 2️⃣ Update user
          await this.userModel.updateOne(
            { stripeCustomerId: data.customer },
            {
              subscriptionStatus: 'expired',
              isSubscriptionAutoRenew: false,
            },
          );

          // 3️⃣ 🔥 REVOKE ALL SUBSCRIPTION-BASED ACCESS
          await this.purchasedCourse.updateMany(
            { subscriptionId: subscription._id },
            { isActive: false },
          );

          await this.purchasedBundle.updateMany(
            { subscriptionId: subscription._id },
            { isActive: false },
          );

          await this.userAssessmentModel.updateMany(
            { subscriptionId: subscription._id },
            { isActive: false },
          );

          console.log(' Subscription deletion processed');
          break;
        }

        default:
          console.log('Unhandled event type:', event.type);
      }

      return { received: true };
    } catch (error) {
      console.error('Stripe webhook error:', error);

      // Return detailed error response for debugging
      const errorMessage = error?.message || 'Unknown error occurred';
      const errorType = error?.type || 'WebhookError';

      return {
        received: false,
        error: errorType,
        message: errorMessage,
        details: error?.raw?.message || errorMessage,
      };
    }
  }
}
