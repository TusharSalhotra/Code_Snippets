import {
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { StripeService } from '../../../../libs/common/src/payment/stripe.service';
import { User } from '../../../../libs/common/src/db/schemas/user.schema';
import { Subscription } from '../../../../libs/common/src/db/schemas/subscription.schema';
import { PurchasedCourse } from '../../../../libs/common/src/db/schemas/purchased-course.schema';
import { PurchaseBundle } from '../../../../libs/common/src/db/schemas/purchase-bundle.schema';
import { UserAssessment } from '../../../../libs/common/src/db/schemas/user-assessment.schema';
import { SubscriptionPlan } from '../../../../libs/common/src/db/schemas/subscription-plan.schema';
import { Stripe } from 'stripe';
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
  ) {}

  @Post()
   async handleWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const stripe = this.stripeService.getClient();
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.STRIPE_WEBHOOK_SECRET_NOT_SET);
      }

      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );

      const data: any = event.data.object;

      switch (event.type) {

        // ✅ PAYMENT SUCCESS
        case 'invoice.payment_succeeded': {
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
          } catch { }

          await this.userModel.updateOne(
            { stripeCustomerId: data.customer },
            {
              subscriptionStatus: 'active',
              subscriptionEndDate: new Date(data.period_end * 1000),
              isSubscriptionAutoRenew: true,
            },
          );
          break;
        }

        // ❌ PAYMENT FAILED (SOFT LOCK)
        case 'invoice.payment_failed': {
          const stripeSubId = data.subscription;

          await this.subscriptionModel.updateOne(
            { stripeSubscriptionId: stripeSubId },
            { status: 'past_due', paymentStatus: 'failed' },
          );

          await this.userModel.updateOne(
            { stripeCustomerId: data.customer },
            { subscriptionStatus: 'past_due' },
          );
          break;
        }

        // ❌ SUBSCRIPTION EXPIRED / CANCELED (HARD REVOKE)
        case 'customer.subscription.deleted': {
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

          if (!subscription) break;

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

          break;
        }
      }

      return { received: true };
    } catch (error) {
      console.log("stripe error", error);
    }
  }

}
