import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, Logger, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import Stripe from 'stripe';

import { StripeService } from '../../../libs/common/src/payment/stripe.service';
import { EmailService } from '../../../libs/common/src/email/email.services';
import { User } from '../../../libs/common/src/db/schemas/user.schema';
import { Company } from '../../../libs/common/src/db/schemas/company.schema';
import { Assessment } from '../../../libs/common/src/db/schemas/assessment.schema';
import { Subscription } from '../../../libs/common/src/db/schemas/subscription.schema';
import { SubscriptionPlan } from '../../../libs/common/src/db/schemas/subscription-plan.schema';
import { SubscribeDto } from './dto/subscribe.dto';
import { UpgradeSubscriptionDto, UpgradePreviewDto } from './dto/upgrade-subscription.dto';
import { RpcException } from '@nestjs/microservices';
import { PurchasedCourse } from '@app/common';
import { PurchaseBundle } from '@app/common';
import { UserAssessment } from '@app/common';
import { PurchasedAssessment, PaymentStatus, GlobalCode, GlobalCodeDocument, CouponUsageType, formatDate, ErrorMessages, ResponseMessages, StatusCodeEnum, CouponType, PaymentHistory, PaymentHistoryDocument, PaymentFor, BundleItems, BundleItemsDocument, BundleItemsType, Common, Affiliate, AffiliateDocument, AffiliateTransaction, AffiliateTransactionDocument, AffiliateTransactionType, AffiliateTransactionStatus, UserType } from '@app/common';
import { CouponService } from 'apps/general/src/coupon/coupon.service';
import { NotificationService } from 'apps/general/src/notification/notification.service';
import { NotificationEvent } from 'apps/general/src/notification/notification-event.enum';
import { EmailEnums, EmailTemplates } from '@app/common';
import { AppointmentPackage, AppointmentPackageDocument } from '@app/common';
import { PurchasedAppointmentPackage, PurchasedAppointmentPackageDocument } from '@app/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';




@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  // In-flight request deduplication: prevents the same subscription request
  // from being processed concurrently by multiple microservice workers
  private readonly activeSubscriptions = new Map<string, Promise<any>>();

  // Redis client for distributed locking across multiple worker processes
  private redisLockClient: Redis | null = null;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,

    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,

    @InjectModel(SubscriptionPlan.name)
    private readonly planModel: Model<SubscriptionPlan>,

  @InjectModel(Assessment.name)
  private readonly assessmentModel: Model<Assessment>,


     // ✅ REQUIRED FOR GRANTING
        @InjectModel(PurchasedCourse.name)
    private readonly purchasedCourse: Model<PurchasedCourse>,

  @InjectModel(PurchaseBundle.name)
  private readonly purchasedBundle: Model<PurchaseBundle>,

    @InjectModel(UserAssessment.name)
    private readonly userAssessmentModel: Model<UserAssessment>,

  @InjectModel(PurchasedAssessment.name)
  private readonly purchasedAssessmentModel: Model<PurchasedAssessment>,

    @InjectModel(GlobalCode.name)
    private readonly globalCodeModel: Model<GlobalCodeDocument>,

    @InjectModel(PaymentHistory.name)
    private readonly paymentHistoryModel: Model<PaymentHistoryDocument>,

    @InjectModel(BundleItems.name)
    private readonly bundleItemsModel: Model<BundleItemsDocument>,

    @InjectModel(AppointmentPackage.name)
    private readonly appointmentPackageModel: Model<AppointmentPackageDocument>,

    @InjectModel(PurchasedAppointmentPackage.name)
    private readonly purchasedAppointmentPackageModel: Model<PurchasedAppointmentPackageDocument>,

    @InjectModel(Affiliate.name)
    private readonly affiliateModel: Model<AffiliateDocument>,

    @InjectModel(AffiliateTransaction.name)
    private readonly affiliateTransactionModel: Model<AffiliateTransactionDocument>,

    private readonly stripeService: StripeService,
    private readonly emailService: EmailService,
    private readonly couponService: CouponService,
    private readonly configService: ConfigService,
    @Optional()
    private readonly notificationService?: NotificationService,


  ) {
    this.initRedisLockClient();
  }

  private initRedisLockClient() {
    try {
      const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
      const port = this.configService.get<number>('REDIS_PORT') || 6379;
      this.redisLockClient = new Redis({ host, port, maxRetriesPerRequest: 3 });
      this.redisLockClient.on('error', (err) => {
        this.logger.error('Redis lock client error', err.message);
      });
    } catch (err) {
      this.logger.error('Failed to initialize Redis lock client', err);
    }
  }

  /**
   * Acquire a distributed lock using Redis SET NX EX.
   * Returns a unique lock value if acquired, or null if the lock is already held.
   */
  private async acquireDistributedLock(key: string, ttlSeconds: number = 60): Promise<string | null> {
    if (!this.redisLockClient) return null;
    const lockValue = `${process.pid}:${Date.now()}`;
    const result = await this.redisLockClient.set(key, lockValue, 'EX', ttlSeconds, 'NX');
    return result === 'OK' ? lockValue : null;
  }

  /**
   * Release a distributed lock only if we still own it.
   */
  private async releaseDistributedLock(key: string, lockValue: string): Promise<void> {
    if (!this.redisLockClient) return;
    const script = `if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end`;
    await this.redisLockClient.eval(script, 1, key, lockValue);
  }

  /**
   * Wait for a distributed lock to be released, then return.
   * Used by non-winning workers to wait for the winner to finish.
   */
  private async waitForLockRelease(key: string, timeoutMs: number = 30000): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const exists = await this.redisLockClient?.exists(key);
      if (!exists) return;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

/**
 * If the plan is a couple plan, returns the partner's user ID (if linked).
 * Returns null if the plan is not a couple plan or the user has no partner.
 */
private async getPartnerIdForCouplePlan(
  userId: Types.ObjectId,
  plan: any,
): Promise<Types.ObjectId | null> {
  const planUserType = (plan.userType || '').toString().trim().toLowerCase();
  if (planUserType !== UserType.COUPLE) return null;

  const user = await this.userModel
    .findById(userId)
    .select('partnerId')
    .lean();

  if (!user?.partnerId) return null;
  return new Types.ObjectId(user.partnerId.toString());
}

/**
 * Grants all subscription content (courses, bundles, assessments, appointment packages)
 * to the partner for a couple plan. Also creates a mirrored subscription record for the partner.
 */
async grantCouplePartnerAccess(
  partnerId: Types.ObjectId,
  purchaserId: Types.ObjectId,
  plan: any,
  subscription: any,
) {
  this.logger.log(`[COUPLE] Granting subscription content to partner ${partnerId} for couple plan`);

  // Create a mirrored subscription record for the partner
  const partnerSubscriptionData: any = {
    userId: partnerId,
    planId: subscription.planId,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
    stripeInvoiceId: subscription.stripeInvoiceId,
    stripePaymentIntentId: subscription.stripePaymentIntentId,
    amountPaid: 0, // Partner doesn't pay
    currency: subscription.currency,
    paymentStatus: PaymentStatus.SUCCEEDED,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
    status: subscription.status,
    couponId: subscription.couponId,
    coachId: subscription.coachId,
    purchasedBy: purchaserId,
    purchasedFor: partnerId,
    appointmentAllowances: Array.isArray(plan.includedAppointments)
      ? plan.includedAppointments.map((a: any) => ({
          appointmentTypeId: a.appointmentTypeId,
          remaining: a.limit,
          limit: a.limit,
        }))
      : [],
  };

  // Check if partner already has an active subscription for this plan
  const existingPartnerSub = await this.subscriptionModel.findOne({
    userId: partnerId,
    planId: subscription.planId,
    status: { $in: ['active', 'past_due', 'pending'] },
  });

  let partnerSubscription: any;
  if (!existingPartnerSub) {
    try {
      partnerSubscription = await this.subscriptionModel.create(partnerSubscriptionData);
      this.logger.log(`[COUPLE] Created partner subscription ${partnerSubscription._id} for partner ${partnerId}`);
    } catch (dbError) {
      if (dbError?.code === 11000) {
        // Another worker already created it — fetch the existing one
        partnerSubscription = await this.subscriptionModel.findOne({
          userId: partnerId,
          planId: subscription.planId,
          status: { $in: ['active', 'past_due', 'pending'] },
        });
        this.logger.log(`[COUPLE] Partner subscription already created by another worker, using existing ${partnerSubscription?._id}`);
      } else {
        throw dbError;
      }
    }
  } else {
    partnerSubscription = existingPartnerSub;
    this.logger.log(`[COUPLE] Partner ${partnerId} already has active subscription for this plan, skipping creation`);
  }

  // Grant content to partner
  await this.grantSubscriptionContent(
    partnerId,
    plan,
    partnerSubscription._id,
  );

  this.logger.log(`[COUPLE] Successfully granted all subscription content to partner ${partnerId}`);
  return partnerSubscription;
}

/**
 * Grants the inviter's active couple subscription content to the partner
 * when the partner accepts the couple invite.
 */
async grantPartnerAccessOnInviteAccept(
  inviterId: string,
  partnerId: string,
) {
  try {
    // Find inviter's active couple subscription
    const subscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(inviterId),
      status: { $in: ['active', 'past_due'] },
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 }).lean();

    if (!subscription) {
      this.logger.log(`[COUPLE] No active subscription found for inviter ${inviterId}, skipping partner access grant`);
      return null;
    }

    // Get the plan to check if it's a couple plan
    const plan = await this.planModel.findById(subscription.planId).lean();
    if (!plan) {
      this.logger.log(`[COUPLE] Plan not found for subscription ${subscription._id}, skipping partner access grant`);
      return null;
    }

    const planUserType = (plan.userType || '').toString().trim().toLowerCase();
    if (planUserType !== UserType.COUPLE) {
      this.logger.log(`[COUPLE] Plan ${plan._id} is not a couple plan, skipping partner access grant`);
      return null;
    }

    // Grant access to partner
    const result = await this.grantCouplePartnerAccess(
      new Types.ObjectId(partnerId),
      new Types.ObjectId(inviterId),
      plan,
      subscription,
    );

    this.logger.log(`[COUPLE] Successfully granted subscription content to partner ${partnerId} on invite accept`);
    return result;
  } catch (error) {
    this.logger.error(`[COUPLE] Error granting partner access on invite accept`, {
      inviterId,
      partnerId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// ADMIN – CREATE PLAN
async createPlan(dto: any, creatorId?: string) {
  const requestId = dto?.__requestId;

  // Acquire a distributed lock on the plan name to prevent duplicate processing
  // across multiple microservice workers receiving the same Redis pub/sub message
  const lockKey = `create_plan_lock:${dto.name}:${dto.interval || 'default'}`;
  const lockValue = await this.acquireDistributedLock(lockKey, 30);

  if (!lockValue) {
    // Another worker is already processing this plan creation — wait for it to finish
    this.logger.warn(`[createPlan] Lock not acquired for "${dto.name}", waiting for other worker...`);
    await this.waitForLockRelease(lockKey, 15000);

    // Return the plan that the winning worker created
    const existingPlan = await this.planModel.findOne({
      name: dto.name,
      isActive: true,
    });
    if (existingPlan) {
      return existingPlan;
    }
    throw new RpcException({
      statusCode: 409,
      message: `Plan creation for "${dto.name}" failed or was handled by another worker`,
    });
  }

  try {
    // Duplicate check: prevent multiple plans with the same name
    const existingPlan = await this.planModel.findOne({
      name: dto.name,
      isActive: true,
    });
    if (existingPlan) {
      throw new RpcException({
        statusCode: 409,
        message: `A plan with the name "${dto.name}" already exists`,
      });
    }

    // Idempotency check using requestId
    if (requestId) {
      const recentDuplicate = await this.planModel.findOne({
        _requestId: requestId,
        createdAt: { $gte: new Date(Date.now() - 60000) },
      });
      if (recentDuplicate) {
        this.logger.warn(`[createPlan] Duplicate request detected (requestId: ${requestId}). Returning existing plan.`);
        return recentDuplicate;
      }
    }

    const stripe = this.stripeService.getClient();

    // MAP INTERVAL FOR STRIPE
    const stripeInterval =
      dto.interval === 'monthly' ? 'month' : 'year';

    // 1. Create Stripe Product
    const product = await stripe.products.create({
      name: dto.name,
    });

    // 2. Create Stripe Recurring Price
    const price = await stripe.prices.create({
      unit_amount: dto.price * 100,
      currency: dto.currency,
      recurring: {
        interval: stripeInterval,
      },
      product: product.id,
    });

    // 3. Save plan in DB
    const { copilotType, __requestId, ...planDataWithoutCopilotType } = dto;

    const planData: any = {
      ...planDataWithoutCopilotType,
      stripeProductId: product.id,
      stripePriceId: price.id,
      createdBy: creatorId ? new Types.ObjectId(creatorId) : undefined,
      _requestId: requestId || undefined,
    };

    // Set aiCoachCopilotStatement based on admin's choice
    if (dto.isAiCoachIncluded && copilotType) {
      planData.aiCoachCopilotStatement = copilotType === 'pro'
        ? 'Mojo™ Pro AI Coach Copilot'
        : 'Mojo™ AI Coach Copilot';
    }

    const plan = await this.planModel.findOneAndUpdate(
      { name: dto.name, isActive: true },
      { $setOnInsert: planData },
      { upsert: true, new: true },
    );

    return plan;
  } finally {
    await this.releaseDistributedLock(lockKey, lockValue);
  }
}


async grantSubscriptionContent(
  userId: Types.ObjectId,
  plan: any,
  subscriptionId: Types.ObjectId,
) {
  // COURSES
  if (plan.includedCourses?.length) {
    const existingCourses = await this.purchasedCourse.find({
      purchasedBy: userId,
      courseId: { $in: plan.includedCourses },
      isActive: true,
      isDeleted: false,
    }).select('courseId');

    const existingSet = new Set(
      existingCourses.map(c => c.courseId.toString()),
    );

    const courses = plan.includedCourses.filter(
      (id: Types.ObjectId) => !existingSet.has(id.toString()),
    );

    if (courses.length) {
      await this.purchasedCourse.insertMany(
        courses.map(courseId => ({
          userId,
          purchasedBy: userId,
          courseId,
          qty: 1,
          paymentStatus: 'succeeded',
          payableAmount: 0,
          paymentMethod: 'subscription',
          isSubscriptionBased: true,
          subscriptionId,
          isActive: true,
        })),
      );
    }
  }

  // BUNDLES
  if (plan.includedBundles?.length) {
    const existingBundles = await this.purchasedBundle.find({
      purchasedBy: userId,
      bundleId: { $in: plan.includedBundles },
      isActive: true,
      isDeleted: false,
    }).select('bundleId');

    const existingSet = new Set(
      existingBundles.map(b => b.bundleId.toString()),
    );

    const bundles = plan.includedBundles.filter(
      (id: Types.ObjectId) => !existingSet.has(id.toString()),
    );

    if (bundles.length) {
      // Grant bundle access
      await this.purchasedBundle.insertMany(
        bundles.map(bundleId => ({
          userId,
          purchasedBy: userId,
          bundleId,
          paymentStatus: 'succeeded',
          payableAmount: 0,
          paymentMethod: 'subscription',
          isSubscriptionBased: true,
          subscriptionId,
          isActive: true,
        })),
      );

      // GRANT ACCESS TO COURSES WITHIN BUNDLES
      
      // Convert bundle IDs to ObjectIds for proper MongoDB query
      const bundleObjectIds = bundles.map(id => 
        typeof id === 'string' ? new Types.ObjectId(id) : id
      );
      
      // First check if any bundle items exist at all
      const allBundleItems = await this.bundleItemsModel.find({
        bundleId: { $in: bundleObjectIds }
      }).select('itemId bundleId type isDeleted isActive');
      console.log('[DEBUG] All bundle items found:', allBundleItems);
      
      const bundleItems = await this.bundleItemsModel.find({
        bundleId: { $in: bundleObjectIds },
        type: BundleItemsType.COURSE,
        isDeleted: false,
        isActive: true,
      }).select('itemId bundleId');
      
      console.log('[DEBUG] Filtered course items:', bundleItems);

      if (bundleItems.length) {
        const courseIds = bundleItems.map(item => item.itemId);
        
        // Check existing course purchases to avoid duplicates
        const existingCourses = await this.purchasedCourse.find({
          purchasedBy: userId,
          courseId: { $in: courseIds },
          isActive: true,
          isDeleted: false,
        }).select('courseId');

        const existingCourseSet = new Set(
          existingCourses.map(c => c.courseId.toString()),
        );

        const newCourses = courseIds.filter(
          courseId => !existingCourseSet.has(courseId.toString()),
        );

        if (newCourses.length) {
          await this.purchasedCourse.insertMany(
            newCourses.map(courseId => ({
              userId,
              purchasedBy: userId,
              courseId,
              qty: 1,
              paymentStatus: 'succeeded',
              payableAmount: 0,
              paymentMethod: 'subscription',
              isSubscriptionBased: true,
              subscriptionId,
              isActive: true,
              // ✅ Link to bundle for tracking
              bundleId: bundleItems.find(item => item.itemId.toString() === courseId.toString())?.bundleId,
            })),
          );
        }
      }
    }
  }

  // ASSESSMENTS
  if (plan.includedAssessments?.length) {
    // Deduplicate against existing purchased assessments for this user
    const existingPurchased = await this.purchasedAssessmentModel.find({
      userId,
      assessmentId: { $in: plan.includedAssessments },
      isDeleted: false,
      isActive: true,
    }).select('assessmentId');

    const existingSet = new Set(
      existingPurchased.map(a => a.assessmentId.toString()),
    );

    const assessments = plan.includedAssessments.filter(
      (id: Types.ObjectId) => !existingSet.has(id.toString()),
    );

    if (assessments.length) {
      // fetch prices to populate monetary fields similar to purchase flow
      const assessmentDocs = await this.assessmentModel.find({
        _id: { $in: assessments },
      }).select({ _id: 1, price: 1 });
      const priceMap = new Map<string, number>();
      assessmentDocs.forEach((a: any) => priceMap.set(a._id.toString(), Number(a.price) || 0));

      await this.purchasedAssessmentModel.insertMany(
        assessments.map((assessmentId: Types.ObjectId) => {
          const baseAmount = priceMap.get(assessmentId.toString()) ?? 0;
          return {
            assessmentId,
            userId,
            purchasedBy: userId,
            paymentStatus: PaymentStatus.SUCCEEDED,
            qty: 1,
            baseAmount,
            totalAmount: baseAmount,
            discountAmount: baseAmount, // fully discounted under subscription
            payableAmount: 0,
            paymentMethod: 'subscription',
            isActive: true,
            isDeleted: false,
            isSubscriptionBased: true,
            subscriptionId,
          } as any;
        }),
      );
    }
  }

  // APPOINTMENT PACKAGES
  this.logger.log(`[grantSubscriptionContent] Processing appointment packages for user ${userId}`, {
    includedAppointmentPackages: plan.includedAppointmentPackages,
    count: plan.includedAppointmentPackages?.length || 0,
  });

  if (plan.includedAppointmentPackages?.length) {
    const existingPurchased = await this.purchasedAppointmentPackageModel.find({
      purchasedBy: userId,
      packageId: { $in: plan.includedAppointmentPackages },
      isActive: true,
      isDeleted: false,
    }).select('packageId');

    this.logger.log(`[grantSubscriptionContent] Existing purchased packages for user ${userId}:`, {
      existingCount: existingPurchased.length,
      existingPackageIds: existingPurchased.map(p => p.packageId.toString()),
    });

    const existingSet = new Set(
      existingPurchased.map(p => p.packageId.toString()),
    );

    const packages = plan.includedAppointmentPackages.filter(
      (id: Types.ObjectId) => !existingSet.has(id.toString()),
    );

    this.logger.log(`[grantSubscriptionContent] New packages to grant for user ${userId}:`, {
      newPackagesCount: packages.length,
      newPackageIds: packages.map((id: any) => id.toString()),
    });

    if (packages.length) {
      const packageDocs = await this.appointmentPackageModel.find({
        _id: { $in: packages },
        isDeleted: false,
        isActive: true,
      });

      this.logger.log(`[grantSubscriptionContent] Found package docs in DB:`, {
        foundCount: packageDocs.length,
        foundIds: packageDocs.map((p: any) => p._id.toString()),
      });

      if (packageDocs.length) {
        const insertData = packageDocs.map((pkg: any) => ({
          packageId: pkg._id,
          purchasedBy: userId,
          paymentStatus: PaymentStatus.SUCCEEDED,
          baseAmount: pkg.price || 0,
          totalAmount: pkg.price || 0,
          discountAmount: pkg.price || 0,
          payableAmount: 0,
          paymentMethod: 'subscription',
          isActive: true,
          isDeleted: false,
          totalMinutes: pkg.totalMinutes || 0,
          remainingMinutes: pkg.totalMinutes || 0,
          validity: pkg.validity || 30,
          expiryDate: new Date(Date.now() + (pkg.validity || 30) * 24 * 60 * 60 * 1000),
          isExpired: false,
        }));

        this.logger.log(`[grantSubscriptionContent] Inserting purchased appointment packages:`, {
          insertCount: insertData.length,
          userId: userId.toString(),
        });

        await this.purchasedAppointmentPackageModel.insertMany(insertData);

        this.logger.log(`[grantSubscriptionContent] Successfully inserted ${insertData.length} purchased appointment packages for user ${userId}`);
      } else {
        this.logger.warn(`[grantSubscriptionContent] No valid package docs found for packages: ${packages.map((id: any) => id.toString()).join(', ')}`);
      }
    }
  }

  // Appointments are not pre-created here; they are consumed via booking.
  // Use subscription.appointmentAllowances to check and decrement quotas
  // at booking time in the appointment service.
}

// this is the subscription function to purchase plan by user
async subscribe(userId: string, dto: any, loginUser?: any) {
  // 🔒 REQUEST DEDUPLICATION: Prevent the same request from being processed
  // by multiple microservice workers concurrently (race condition via Redis pub/sub)
  const subscriptionTargetUserId = dto.clientId || userId;
  const deduplicationKey = `${subscriptionTargetUserId}:${dto.planId}`;

  // If there's already an in-flight subscription for this user+plan on THIS worker, wait for it
  const existingRequest = this.activeSubscriptions.get(deduplicationKey);
  if (existingRequest) {
    console.log(`[SUBSCRIBE] Duplicate request detected on same worker for user ${subscriptionTargetUserId}, plan ${dto.planId}. Waiting for existing request to complete.`);
    this.logger.warn('Duplicate subscription request detected, returning existing result', { userId, planId: dto.planId });
    return existingRequest;
  }

  // 🔒 DISTRIBUTED LOCK: Prevent multiple workers from processing the same subscription
  const redisLockKey = `subscribe_lock:${subscriptionTargetUserId}:${dto.planId}`;
  const lockValue = await this.acquireDistributedLock(redisLockKey, 60);

  if (!lockValue) {
    // Another worker already processing this subscription — wait for it to finish
    console.log(`[SUBSCRIBE] Another worker is processing subscription for user ${subscriptionTargetUserId}, plan ${dto.planId}. Waiting...`);
    this.logger.warn('Distributed lock held by another worker, waiting for completion', { userId, planId: dto.planId });

    await this.waitForLockRelease(redisLockKey, 30000);

    // After lock is released, check if subscription was created successfully
    const createdSubscription = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(subscriptionTargetUserId),
      planId: new Types.ObjectId(dto.planId),
      status: { $in: ['active', 'past_due', 'pending'] },
    });

    if (createdSubscription) {
      console.log(`[SUBSCRIBE] Subscription already created by another worker for user ${subscriptionTargetUserId}`);
      return {
        status: createdSubscription.paymentStatus || 'succeeded',
        subscriptionId: createdSubscription._id,
        finalAmount: createdSubscription.amountPaid,
      };
    }

    // If no subscription found, the other worker may have failed — proceed to try ourselves
    console.log(`[SUBSCRIBE] No subscription found after lock release, retrying...`);
    return this.subscribe(userId, dto, loginUser);
  }

  // We acquired the lock — proceed with subscription
  const subscriptionPromise = this._executeSubscribe(userId, dto, loginUser);
  this.activeSubscriptions.set(deduplicationKey, subscriptionPromise);

  try {
    const result = await subscriptionPromise;
    return result;
  } finally {
    // Release the distributed lock
    await this.releaseDistributedLock(redisLockKey, lockValue);
    // Clean up in-memory dedup after a brief delay
    setTimeout(() => {
      this.activeSubscriptions.delete(deduplicationKey);
    }, 5000);
  }
}

private async _executeSubscribe(userId: string, dto: any, loginUser?: any) {
  try {
    console.log(' [SUBSCRIBE] Starting subscription process', { userId, dto });
    this.logger.log(`Starting subscription process for user ${userId}`, { planId: dto.planId, hasPaymentMethod: !!dto.paymentMethodId, hasCouponCode: !!dto.couponCode });
    
    const { planId, paymentMethodId, couponCode, coachId, clientId } = dto;
    const purchasedForUserId = clientId; // Alias for clarity

    if (!planId) {
      console.log('[SUBSCRIBE] Missing planId');
      this.logger.error('Subscription failed: Missing planId', { userId });
      throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.PLANID_REQUIRED);
    }

    if (!Types.ObjectId.isValid(planId)) {
      console.log('[SUBSCRIBE] Invalid planId format', { planId });
      this.logger.error('Subscription failed: Invalid planId format', { userId, planId });
      throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_PLANID);
    }

    console.log('[SUBSCRIBE] Input validation passed', { userId, planId, hasPaymentMethod: !!paymentMethodId, hasCouponCode: !!couponCode });
    this.logger.log('Input validation passed', { userId, planId });

    // 1️⃣ USER + PLAN
    const subscriptionTargetUserId = purchasedForUserId || userId;
    console.log('[SUBSCRIBE] Fetching user and plan data');
    this.logger.log('Fetching user and plan data', { userId, subscriptionTargetUserId, planId, isAdminPurchase: !!purchasedForUserId });
    const user = await this.userModel.findById(subscriptionTargetUserId);
    const plan = await this.planModel.findById(planId);

    console.log('[SUBSCRIBE] User found:', {
      subscriptionTargetUserId,
      userExists: !!user,
      userEmail: user?.email,
      stripeCustomerId: user?.stripeCustomerId,
      isAdminPurchase: !!purchasedForUserId
    });
    
    console.log('[SUBSCRIBE] Plan found:', { 
      planId, 
      planExists: !!plan, 
      planName: plan?.name,
      planPrice: plan?.price,
      planCurrency: plan?.currency,
      planInterval: plan?.interval,
      planActive: plan?.isActive,
      stripePriceId: plan?.stripePriceId,
      stripeProductId: plan?.stripeProductId
    });

    this.logger.log('User and plan data retrieved', { 
      userExists: !!user, 
      userEmail: user?.email,
      planExists: !!plan, 
      planName: plan?.name,
      planPrice: plan?.price,
      planActive: plan?.isActive
    });

    if (!user || !plan || !plan.isActive) {
      console.log('[SUBSCRIBE] User or plan validation failed', {
        subscriptionTargetUserId,
        userExists: !!user,
        planExists: !!plan,
        planActive: plan?.isActive
      });
      this.logger.error('User or plan validation failed', {
        subscriptionTargetUserId,
        userExists: !!user,
        planExists: !!plan,
        planActive: plan?.isActive
      });
      throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_SUBSCRIPTION);
    }

    // 🔹 NEW: Coupon validation
    console.log('[SUBSCRIBE] Starting coupon validation', { couponCode });
    this.logger.log('Starting coupon validation', { userId, couponCode: !!couponCode });
    let discountAmount = 0;
    let couponId: string | undefined;
    let stripeCouponId: string | undefined;
    let finalAmount = plan.price;

    if (couponCode) {
      console.log('[SUBSCRIBE] Processing coupon', { couponCode });
      this.logger.log('Processing coupon code', { userId, couponCode });
      
      const nowUtcIso = await formatDate(new Date());
      console.log('[SUBSCRIBE] Current UTC ISO date for coupon validation:', nowUtcIso);
      
      const couponDetails = await this.couponService.getByAttributes(
        {
          couponCode,
          isDeleted: false,
          isActive: true,
          expirationDate: { $gte: new Date(nowUtcIso) },
        },
        { langCode: 'en' } as any,
      );

      console.log('[SUBSCRIBE] Coupon details retrieved:', {
        couponId: couponDetails._id,
        couponCode: couponDetails.couponCode,
        discountTypeName: couponDetails.discountTypeName,
        discountValue: couponDetails.discountValue,
        usageTypeName: couponDetails.usageTypeName,
        expirationDate: couponDetails.expirationDate,
        couponCategory: couponDetails.couponCategory
      });

      this.logger.log('Coupon details retrieved', {
        userId,
        couponId: couponDetails._id,
        discountTypeName: couponDetails.discountTypeName,
        discountValue: couponDetails.discountValue,
        usageTypeName: couponDetails.usageTypeName
      });

      // Validate coupon category is 'subscription'
      const couponCategory = await this.globalCodeModel.findOne({
        _id: couponDetails.couponCategory,
        isDeleted: false,
        isActive: true
      });

      console.log('[SUBSCRIBE] Coupon category validation:', {
        categoryFound: !!couponCategory,
        categoryValue: couponCategory?.value,
        isSubscriptionCategory: couponCategory?.value === 'subscription'
      });

      if (!couponCategory || couponCategory.value !== 'subscription') {
        console.log('[SUBSCRIBE] Invalid coupon category');
        this.logger.error('Invalid coupon category for subscription', {
          userId,
          couponCode,
          categoryValue: couponCategory?.value
        });
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages.en.INVALID_COUPON,
        });
      }

      // Check one-time usage
      if (couponDetails.usageTypeName === CouponUsageType.ONE_TIME) {
        console.log('[SUBSCRIBE] Checking one-time coupon usage for user');
        this.logger.log('Checking one-time coupon usage', { subscriptionTargetUserId, couponCode });

        const couponUsed = await this.subscriptionModel.findOne({
          couponId: couponDetails._id,
          userId: new Types.ObjectId(subscriptionTargetUserId),
          status: { $in: ['active', 'past_due'] },
        });
        console.log('[SUBSCRIBE] One-time coupon usage check:', {
          alreadyUsed: !!couponUsed,
          existingSubscriptionId: couponUsed?._id
        });

        if (couponUsed) {
          console.log('[SUBSCRIBE] Coupon already used by this user');
          this.logger.error('One-time coupon already used by user', {
            subscriptionTargetUserId,
            couponCode,
            existingSubscriptionId: couponUsed._id
          });
          throw new RpcException({
            statusCode: StatusCodeEnum.BAD_REQUEST,
            message: ErrorMessages.en.COUPON_ALREADY_USED,
          });
        }
      }

      // Calculate discount
      const { discountTypeName, discountValue } = couponDetails;
      console.log('[SUBSCRIBE] Calculating discount:', {
        originalPrice: plan.price,
        discountTypeName,
        discountValue
      });
      
      if (discountTypeName === CouponType.PERCENTAGE) {
        discountAmount = parseFloat(((plan.price * discountValue) / 100).toFixed(2));
      } else if (discountTypeName === CouponType.PRICE) {
        discountAmount = discountValue;
      }
      
      finalAmount = Math.max(0, parseFloat((plan.price - discountAmount).toFixed(2)));
      couponId = couponDetails._id.toString();

      console.log('[SUBSCRIBE] Discount calculated:', {
        originalPrice: plan.price,
        discountAmount,
        finalAmount,
        couponId
      });

      this.logger.log('Discount calculated successfully', {
        userId,
        originalPrice: plan.price,
        discountAmount,
        finalAmount,
        couponId,
        discountType: discountTypeName
      });

      // 🔹 NEW: Create/Get Stripe Coupon
      try {
        console.log('[SUBSCRIBE] Creating/getting Stripe coupon');
        this.logger.log('Creating/getting Stripe coupon', { userId, couponCode });
        
        stripeCouponId = await this.stripeService.getOrCreateStripeCoupon(
          couponCode,
          discountTypeName === CouponType.PERCENTAGE ? 'percentage' : 'amount',
          discountValue,
          discountTypeName === CouponType.PRICE ? (plan.currency || 'usd') : undefined
        );
        
        console.log('[SUBSCRIBE] Stripe coupon created/retrieved:', { stripeCouponId });
        this.logger.log('Stripe coupon created/retrieved successfully', { userId, stripeCouponId });
      } catch (stripeError: any) {
        console.error('❌ [SUBSCRIBE] Failed to create/get Stripe coupon:', stripeError);
        this.logger.error('Failed to create/get Stripe coupon', {
          userId,
          couponCode,
          error: stripeError.message
        });
        throw new RpcException({
          statusCode: StatusCodeEnum.INTERNAL_SERVER_ERROR,
          message: ErrorMessages[Common.DEFAULT_LANG]?.FAILED_TO_APPLY_COUPON,
        });
      }
    } else {
      console.log('[SUBSCRIBE] No coupon code provided, skipping coupon validation');
      this.logger.log('No coupon code provided, proceeding without discount', { userId });
    }

    // 2️⃣ SMART DUPLICATE CHECK WITH UPGRADE DETECTION
    console.log('[SUBSCRIBE] Checking for duplicate subscription');
    this.logger.log('Checking for duplicate subscription', { subscriptionTargetUserId, planId });

    const existing = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(subscriptionTargetUserId),
      planId: new Types.ObjectId(planId),
      status: { $in: ['active', 'past_due', 'pending'] },
    });

    console.log('[SUBSCRIBE] Duplicate check result:', {
      existingSubscription: !!existing,
      existingId: existing?._id,
      existingStatus: existing?.status
    });

    if (existing) {
      console.log('[SUBSCRIBE] User already has active subscription for this plan');
      this.logger.error('User already has active subscription for this plan', {
        subscriptionTargetUserId,
        planId,
        existingSubscriptionId: existing._id
      });
      throw new RpcException({
        statusCode: 400,
        message: ErrorMessages[Common.DEFAULT_LANG]?.USER_ALREADY_HAS_ACTIVE_SUBSCRIPTION,
      });
    }

    // 🔥 NEW: Check for existing active subscription on different plan (upgrade opportunity)
    // Allow users with both CLIENT and COUPLE roles to have one individual plan + one couple plan
    console.log('[SUBSCRIBE] Checking for existing active subscriptions on different plans');
    this.logger.log('Checking for existing active subscriptions on different plans', { subscriptionTargetUserId });

    const newPlanUserType = (plan.userType || '').toString().trim().toLowerCase();

    const existingActiveSubscriptions = await this.subscriptionModel.find({
      userId: new Types.ObjectId(subscriptionTargetUserId),
      status: { $in: ['active', 'past_due'] },
    }).populate('planId');

    console.log('[SUBSCRIBE] Active subscriptions check:', {
      count: existingActiveSubscriptions.length,
      newPlanUserType,
    });

    // Find if there's an existing subscription with the SAME userType as the new plan
    const conflictingSubscription = existingActiveSubscriptions.find((sub) => {
      const existingPlan = sub.planId as any;
      const existingPlanUserType = (existingPlan?.userType || '').toString().trim().toLowerCase();
      return existingPlanUserType === newPlanUserType;
    });

    if (conflictingSubscription) {
      const currentPlan = conflictingSubscription.planId as any;

      console.log('[SUBSCRIBE] Conflicting subscription found with same userType:', {
        currentPlanPrice: currentPlan.price,
        newPlanPrice: plan.price,
        userType: newPlanUserType,
        isUpgrade: plan.price > currentPlan.price
      });

      this.logger.log('Found existing active subscription with same userType, comparing plans', {
        userId,
        currentPlanId: currentPlan._id,
        currentPlanPrice: currentPlan.price,
        newPlanId: plan._id,
        newPlanPrice: plan.price,
        userType: newPlanUserType,
        isUpgrade: plan.price > currentPlan.price
      });

      // If new plan price is higher, suggest upgrade
      if (plan.price > currentPlan.price) {
        console.log('[SUBSCRIBE] Suggesting upgrade path');
        this.logger.warn('Suggesting upgrade instead of new subscription', {
          userId,
          currentPlan: currentPlan.name,
          suggestedPlan: plan.name
        });
        throw new RpcException({
          statusCode: 409, // Conflict
          message: ErrorMessages[Common.DEFAULT_LANG]?.CONSIDER_UPGRADING_INSTEAD,
          data: {
            currentPlan: {
              id: currentPlan._id,
              name: currentPlan.name,
              price: currentPlan.price,
            },
            suggestedPlan: {
              id: plan._id,
              name: plan.name,
              price: plan.price,
            },
            action: 'upgrade',
            endpoint: 'subscription-upgrade'
          }
        });
      } else {
        // If new plan price is lower or same, just inform about current subscription
        console.log('[SUBSCRIBE] User trying to downgrade or get same plan');
        this.logger.error('User trying to downgrade or get same plan', {
          userId,
          currentPlan: currentPlan.name,
          requestedPlan: plan.name
        });
        throw new RpcException({
          statusCode: 400,
          message: ErrorMessages[Common.DEFAULT_LANG]?.CANCEL_CURRENT_SUBSCRIPTION_FIRST?.replace('{plan}', currentPlan.name),
        });
      }
    } else if (existingActiveSubscriptions.length > 0) {
      console.log('[SUBSCRIBE] User has active subscription(s) but with different userType, allowing purchase of new plan type:', newPlanUserType);
      this.logger.log('Allowing subscription with different userType', {
        userId,
        existingCount: existingActiveSubscriptions.length,
        newPlanUserType,
      });
    }

    console.log('[SUBSCRIBE] No duplicate or conflicting subscriptions found, proceeding...');
    this.logger.log('No duplicate or conflicting subscriptions found, proceeding with subscription creation', { userId });

    // 3️⃣ STRIPE CUSTOMER
    console.log('[SUBSCRIBE] Setting up Stripe customer');
    this.logger.log('Setting up Stripe customer', { userId, hasExistingCustomerId: !!user.stripeCustomerId });
    
    let customerId = user.stripeCustomerId;
    const stripe = this.stripeService.getClient();

    console.log('[SUBSCRIBE] Initial customer setup:', {
      existingCustomerId: customerId,
      hasExistingCustomer: !!customerId
    });

    // Verify existing customer or create new one
    if (customerId) {
      console.log('[SUBSCRIBE] Verifying existing Stripe customer:', customerId);
      this.logger.log('Verifying existing Stripe customer', { userId, customerId });
      
      try {
        // Verify the customer exists in Stripe
        const existingCustomer = await stripe.customers.retrieve(customerId);
        console.log('[SUBSCRIBE] Existing customer verified successfully:', {
          customerId,
          email: 'deleted' in existingCustomer ? 'N/A (deleted)' : existingCustomer.email,
          deleted: existingCustomer.deleted
        });
        this.logger.log('Existing Stripe customer verified successfully', { userId, customerId });
      } catch (error: any) {
        console.log('[SUBSCRIBE] Customer verification failed:', {
          customerId,
          errorCode: error.code,
          errorType: error.type,
          errorMessage: error.message
        });
        
        if (error.code === 'resource_missing') {
          // Customer doesn't exist in Stripe, clear the invalid ID and create new one
          console.log(`[SUBSCRIBE] Stripe customer ${customerId} not found, will create new customer for user ${userId}`);
          this.logger.warn('Stripe customer not found, will create new one', { userId, invalidCustomerId: customerId });
          customerId = undefined;
          user.stripeCustomerId = undefined;
          await user.save();
          console.log('[SUBSCRIBE] Cleared invalid customer ID from user record');
        } else {
          // Other Stripe errors, re-throw
          console.log('[SUBSCRIBE] Stripe customer verification error (non-missing):', error);
          this.logger.error('Stripe customer verification failed', { userId, customerId, error: error.message });
          throw error;
        }
      }
    }

    if (!customerId) {
      console.log(' [SUBSCRIBE] Creating new Stripe customer');
      this.logger.log('Creating new Stripe customer', { userId, userEmail: user.email });
      
      const customerData = {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      };
      
      console.log('[SUBSCRIBE] Customer creation data:', customerData);
      
      const customer = await stripe.customers.create(customerData);
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
      
      console.log(` [SUBSCRIBE] Created new Stripe customer ${customerId} for user ${userId}`);
      this.logger.log('New Stripe customer created successfully', { userId, newCustomerId: customerId });
    }

    console.log('[SUBSCRIBE] Stripe customer setup complete:', { finalCustomerId: customerId });
    this.logger.log('Stripe customer setup complete', { userId, customerId });

    // 4️⃣ ATTACH PAYMENT METHOD (only if payment required)
    console.log('[SUBSCRIBE] Processing payment method attachment');
    console.log('[SUBSCRIBE] Payment requirement check:', {
      finalAmount,
      paymentRequired: finalAmount > 0,
      paymentMethodProvided: !!paymentMethodId,
      paymentMethodId: paymentMethodId
    });
    
    if (finalAmount > 0 && paymentMethodId && paymentMethodId.trim() !== '') {
      console.log('💳 [SUBSCRIBE] Attaching payment method to customer');

      try {
        await this.stripeService.attachPaymentMethodToCustomer(
          customerId,
          paymentMethodId,
        );
        console.log('[SUBSCRIBE] Payment method attached successfully');
      } catch (error: any) {
        const errorCode = error.error?.code || error.code;
        const errorMessage = error.error?.message || error.message;

        console.log('❌ [SUBSCRIBE] Payment method attachment failed:', {
          errorMessage,
          errorCode,
          errorType: error.type,
          statusCode: error.error?.statusCode
        });

        // Handle payment method not found (credential change scenario)
        if (errorCode === 'STRIPE_PAYMENT_METHOD_NOT_FOUND' ||
            errorMessage?.includes('payment method is no longer valid')) {
          console.log('💳 [SUBSCRIBE] Payment method not found - Stripe credentials may have changed');
          throw new InternalServerErrorException(
            'Your saved payment method is no longer valid. Please add a new payment method and try again.'
          );
        }

        // Handle customer not found (credential change scenario)
        if (errorCode === 'STRIPE_CUSTOMER_NOT_FOUND' ||
            errorMessage?.includes('STRIPE_CUSTOMER_NOT_FOUND') ||
            (error.error?.statusCode === 400 && errorMessage?.includes('Customer not found'))) {
          console.log('🏪 [SUBSCRIBE] Customer not found during payment method attachment, creating new customer');

          // Create new customer
          const newCustomer = await stripe.customers.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          });
          customerId = newCustomer.id;
          user.stripeCustomerId = customerId;
          await user.save();

          console.log('🏪 [SUBSCRIBE] New customer created during payment method attachment:', { newCustomerId: customerId });

          // Retry attaching payment method with new customer
          try {
            await this.stripeService.attachPaymentMethodToCustomer(
              customerId,
              paymentMethodId,
            );
            console.log('✅ [SUBSCRIBE] Payment method attached successfully after customer recreation');
          } catch (retryError: any) {
            const retryErrorCode = retryError.error?.code || retryError.code;
            // If payment method still fails, it's likely invalid
            if (retryErrorCode === 'STRIPE_PAYMENT_METHOD_NOT_FOUND') {
              throw new InternalServerErrorException(
                'Your saved payment method is no longer valid. Please add a new payment method and try again.'
              );
            }
            throw retryError;
          }
        } else {
          console.log('[SUBSCRIBE] Payment method attachment failed with unhandled error');
          throw error;
        }
      }
    } else {
      console.log(' [SUBSCRIBE] Skipping payment method attachment:', {
        reason: finalAmount === 0 ? 'No payment required' : 'No payment method provided',
        finalAmount,
        hasPaymentMethod: !!paymentMethodId
      });
    }

    // 4️⃣.5 PREPARE COACH AFFILIATE TRANSFER DATA (for destination charges)
    // This lookup must happen BEFORE creating the subscription to enable destination charges
    let transferData: { coachConnectAccountId: string; applicationFeePercent: number } | undefined;
    let usedDestinationCharge = false;

    if (coachId && finalAmount > 0) {
      console.log('[SUBSCRIBE] Checking coach affiliate eligibility for destination charge, coachId:', coachId);
      try {
        // Find affiliate record to get coach percentage
        // Query both ObjectId and string formats since data may be stored either way
        const affiliate = await this.affiliateModel.findOne({
          $or: [
            { coachId: new Types.ObjectId(coachId) },
            { coachId: coachId }, // Also match if stored as string
          ],
          isActive: true,
          isDeleted: false,
        });

        if (affiliate) {
          console.log('[SUBSCRIBE] Found affiliate record:', {
            coachId: affiliate.coachId,
            coachPercentage: affiliate.coachPercentage,
          });

          // Find coach to get their Stripe Connect account ID
          const coach = await this.userModel.findById(coachId).lean();

          if (coach && coach.stripeConnectAccountId && coach.stripeConnectOnboardingComplete) {
            // For destination charges, we need to calculate applicationFeePercent so that
            // the coach receives their percentage of the NET amount (after Stripe fees)
            //
            // Stripe fee is approximately 2.9% + €0.30
            // Formula: We want coach to get coachPercentage% of (payment - stripeFee)
            //
            // Math:
            // - Net after Stripe = payment * (1 - 0.029) - 0.30
            // - Coach should get = Net * coachPercentage / 100
            // - With destination charge: Coach gets = payment * (1 - applicationFeePercent/100)
            // - So: payment * (1 - appFee/100) = (payment * 0.971 - 0.30) * coachPct / 100
            // - Solving: appFee = 100 - 0.971 * coachPct + (0.30 * coachPct / 100) / payment * 100
            //
            const stripeFeePercent = 2.9;
            const stripeFixedFee = 0.30; // €0.30 or $0.30
            const coachPercentage = affiliate.coachPercentage;

            // Calculate adjusted application fee to give coach their % of NET (after Stripe fee)
            const adjustedApplicationFeePercent =
              100 -
              (1 - stripeFeePercent / 100) * coachPercentage +
              (stripeFixedFee * coachPercentage / 100) / finalAmount * 100;

            // Round to 2 decimal places (Stripe accepts up to 2 decimals)
            const applicationFeePercent = Math.round(adjustedApplicationFeePercent * 100) / 100;

            transferData = {
              coachConnectAccountId: coach.stripeConnectAccountId,
              applicationFeePercent,
            };
            usedDestinationCharge = true;

            // Calculate expected split for logging
            const estimatedStripeFee = finalAmount * stripeFeePercent / 100 + stripeFixedFee;
            const estimatedNet = finalAmount - estimatedStripeFee;
            const expectedCoachShare = estimatedNet * coachPercentage / 100;
            const expectedPlatformShare = estimatedNet - expectedCoachShare;

            console.log('[SUBSCRIBE] Coach eligible for destination charge (NET-based split):', {
              coachConnectAccountId: coach.stripeConnectAccountId,
              coachPercentage: coachPercentage,
              paymentAmount: finalAmount,
              estimatedStripeFee: estimatedStripeFee.toFixed(2),
              estimatedNetAfterFee: estimatedNet.toFixed(2),
              expectedCoachShare: expectedCoachShare.toFixed(2),
              expectedPlatformShare: expectedPlatformShare.toFixed(2),
              applicationFeePercent: applicationFeePercent,
            });
          } else {
            console.log('[SUBSCRIBE] Coach not eligible for destination charge:', {
              coachId,
              hasConnectAccountId: !!coach?.stripeConnectAccountId,
              onboardingComplete: coach?.stripeConnectOnboardingComplete,
            });
          }
        } else {
          console.log('[SUBSCRIBE] No active affiliate record found for coach:', coachId);
        }
      } catch (affiliateError) {
        // Log error but don't fail - we can fall back to separate transfer later
        console.error('[SUBSCRIBE] Error checking affiliate eligibility:', affiliateError);
      }
    }

    // 5️⃣ CREATE STRIPE SUBSCRIPTION (with coupon if applied)
    console.log('[SUBSCRIBE] Creating Stripe subscription');
    console.log('[SUBSCRIBE] Subscription creation parameters:', {
      customerId,
      stripePriceId: plan.stripePriceId,
      stripeCouponId,
      hasCoupon: !!stripeCouponId
    });

    let stripeSub: any;
    try {
      stripeSub = await this.stripeService.createSubscription(
        customerId,
        plan.stripePriceId,
        stripeCouponId, // Pass Stripe coupon ID if available
        transferData, // Pass transfer data for destination charge (coach affiliate split)
      );
      
      console.log('[SUBSCRIBE] Stripe subscription created successfully:', {
        subscriptionId: stripeSub.id,
        status: stripeSub.status,
        currentPeriodStart: stripeSub.current_period_start,
        currentPeriodEnd: stripeSub.current_period_end,
        latestInvoiceId: stripeSub.latest_invoice
      });
      
    } catch (error: any) {
      console.log('[SUBSCRIBE] Stripe subscription creation failed:', {
        errorMessage: error.message,
        errorType: error.type,
        errorCode: error.code
      });
      
      // Handle missing price - recreate it
      if (error.code === 'resource_missing' && error.message && error.message.includes('price')) {
        console.log('[SUBSCRIBE] Stripe price not found, recreating price and product');
        
        // First, create or get the product
        let product: any;
        try {
          if (plan.stripeProductId) {
            console.log('[SUBSCRIBE] Attempting to retrieve existing product:', plan.stripeProductId);
            product = await stripe.products.retrieve(plan.stripeProductId);
            console.log('[SUBSCRIBE] Product retrieved successfully');
          } else {
            throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.NO_PRODUCT_ID_CREATE_NEW);
          }
        } catch (productError: any) {
          console.log('[SUBSCRIBE] Product not found or error, creating new product:', {
            productError: productError.message,
            planName: plan.name
          });
          
          // Product doesn't exist, create new one
          product = await stripe.products.create({
            name: plan.name,
            description: `Subscription plan: ${plan.name}`,
          });
          
          console.log('[SUBSCRIBE] New product created:', { productId: product.id });
          
          // Update plan with new product ID
          plan.stripeProductId = product.id;
          await plan.save();
          console.log('[SUBSCRIBE] Plan updated with new product ID');
        }
        
        console.log('[SUBSCRIBE] Creating new price for product');
        
        // Create new price
        const newPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(plan.price * 100), // Convert to cents
          currency: plan.currency || 'usd',
          recurring: {
            interval: plan.interval === 'monthly' ? 'month' : 'year',
          },
        });
        
        console.log('[SUBSCRIBE] New price created:', {
          priceId: newPrice.id,
          unitAmount: newPrice.unit_amount,
          currency: newPrice.currency,
          interval: newPrice.recurring?.interval
        });
        
        // Update plan with new price ID
        plan.stripePriceId = newPrice.id;
        await plan.save();
        console.log('[SUBSCRIBE] Plan updated with new price ID');
        
        // Retry creating subscription with new price
        stripeSub = await this.stripeService.createSubscription(
          customerId,
          newPrice.id,
          stripeCouponId,
          transferData, // Pass transfer data for destination charge
        );

        console.log('[SUBSCRIBE] Subscription created with new price');

      } else if (error.message && error.message.includes('STRIPE_CUSTOMER_NOT_FOUND')) {
        console.log('[SUBSCRIBE] Customer not found during subscription creation, recreating customer');

        // Customer doesn't exist, recreate and try again
        const newCustomer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        });
        customerId = newCustomer.id;
        user.stripeCustomerId = customerId;
        await user.save();

        console.log('[SUBSCRIBE] Customer recreated for subscription:', { newCustomerId: customerId });

        // Retry creating subscription with new customer
        stripeSub = await this.stripeService.createSubscription(
          customerId,
          plan.stripePriceId,
          stripeCouponId,
          transferData, // Pass transfer data for destination charge
        );

        console.log(' [SUBSCRIBE] Subscription created after customer recreation');
        
      } else {
        console.log('[SUBSCRIBE] Unhandled subscription creation error');
        throw error;
      }
    }

    const invoice: any = stripeSub.latest_invoice;
    const paymentIntent = invoice?.payment_intent;

    console.log('[SUBSCRIBE] Processing invoice and payment intent:', {
      invoiceId: invoice?.id,
      invoiceStatus: invoice?.status,
      invoiceAmountDue: invoice?.amount_due,
      paymentIntentId: paymentIntent?.id,
      paymentIntentStatus: paymentIntent?.status,
      paymentIntentAmount: paymentIntent?.amount
    });

    // 6️⃣ SAVE SUBSCRIPTION
    console.log('[SUBSCRIBE] Saving subscription to database');

    const subscriptionData: any = {
      userId: new Types.ObjectId(subscriptionTargetUserId),
      planId: new Types.ObjectId(planId),
      stripeSubscriptionId: stripeSub.id,
      stripeInvoiceId: invoice?.id,
      stripePaymentIntentId: paymentIntent?.id,
      amountPaid: finalAmount,
      currency: plan.currency || 'usd',
      paymentStatus: finalAmount === 0 ? PaymentStatus.SUCCEEDED : (paymentIntent?.status ?? PaymentStatus.PENDING),
      startDate: new Date(),
      endDate: new Date((stripeSub as any).current_period_end * 1000),
      status: 'active',
      couponId: couponId ? new Types.ObjectId(couponId) : undefined,
      stripeCouponId: stripeCouponId,
      discountAmount,
      coachId: coachId ? new Types.ObjectId(coachId) : undefined,
      appointmentAllowances: Array.isArray((plan as any).includedAppointments)
        ? (plan as any).includedAppointments.map((a: any) => ({
            appointmentTypeId: a.appointmentTypeId,
            remaining: a.limit,
            limit: a.limit,
          }))
        : [],
    };

    // Only add purchasedBy and purchasedFor if admin is buying for client
    if (purchasedForUserId && loginUser?._id) {
      subscriptionData.purchasedBy = new Types.ObjectId(loginUser._id);
      subscriptionData.purchasedFor = new Types.ObjectId(purchasedForUserId);
    }
    
    console.log(' [SUBSCRIBE] Subscription data to save:', {
      userId: subscriptionData.userId,
      purchasedBy: subscriptionData.purchasedBy,
      purchasedFor: subscriptionData.purchasedFor,
      planId: subscriptionData.planId,
      stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
      amountPaid: subscriptionData.amountPaid,
      currency: subscriptionData.currency,
      paymentStatus: subscriptionData.paymentStatus,
      status: subscriptionData.status,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      hasCoupon: !!subscriptionData.couponId,
      discountAmount: subscriptionData.discountAmount,
      appointmentAllowancesCount: subscriptionData.appointmentAllowances.length
    });
    
    let subscription;
    try {
      subscription = await this.subscriptionModel.create(subscriptionData);
    } catch (dbError) {
      // Handle duplicate key error (race condition: another worker already created this subscription)
      if (dbError?.code === 11000) {
        console.log('[SUBSCRIBE] Duplicate subscription detected (another worker created it first), fetching existing subscription');
        subscription = await this.subscriptionModel.findOne({
          userId: new Types.ObjectId(subscriptionTargetUserId),
          planId: new Types.ObjectId(planId),
          status: 'active',
        });
        if (subscription) {
          console.log('[SUBSCRIBE] Found existing subscription:', {
            subscriptionId: subscription._id,
            subscriptionStatus: subscription.status
          });
          this.logger.log('Using existing subscription created by another worker', {
            userId,
            subscriptionId: subscription._id,
            planId,
          });
          // Return early — the other worker will handle email, notifications, content granting, etc.
          return {
            status: true,
            message: 'Subscription activated successfully',
            data: {
              subscriptionId: subscription._id,
              status: subscription.paymentStatus,
              clientSecret: paymentIntent?.client_secret,
              amountPaid: finalAmount,
              discountAmount,
              couponApplied: !!couponId,
            },
          };
        }
        // If we somehow can't find the existing subscription, re-throw
        throw dbError;
      }
      throw dbError;
    }

    console.log('[SUBSCRIBE] Subscription saved successfully:', {
      subscriptionId: subscription._id,
      subscriptionStatus: subscription.status
    });
    this.logger.log('Subscription saved successfully to database', {
      userId,
      subscriptionId: subscription._id,
      planId,
      finalAmount,
      status: subscription.status
    });

    // 🆕 CREATE PAYMENT HISTORY
    console.log('[SUBSCRIBE] Creating payment history record');
    console.log(' [SUBSCRIBE] Coupon variables before payment history:', {
      couponCode,
      couponId,
      stripeCouponId,
      discountAmount,
      finalAmount
    });
    
    const paymentHistoryData = {
      paidBy: new Types.ObjectId(subscriptionTargetUserId), // Always show client's name in transaction history
      subscriptionId: subscription._id,
      couponId: couponId ? new Types.ObjectId(couponId) : undefined,
      amount: finalAmount,
      paymentFor: PaymentFor.SUBSCRIPTION,
      stripePaymentIntentId: finalAmount > 0 ? paymentIntent?.id || '' : '',
      paymentDate: new Date(),
      metaData: finalAmount > 0
        ? {
            subscriptionId: stripeSub.id,
            invoiceId: invoice?.id,
            paymentIntentId: paymentIntent?.id,
            planName: plan.name || plan._id?.toString() || 'Subscription Plan',
            planId: plan._id,
            planPrice: plan.price,
            discountAmount,
            finalAmount,
            status: paymentIntent?.status || PaymentStatus.SUCCEEDED,
            type: 'subscription',
            interval: plan.interval,
            couponApplied: !!couponId,
            couponId: couponId || null,
            couponCode: couponCode || null,
            stripeCouponId: stripeCouponId || null,
          }
        : {
            status: PaymentStatus.SUCCEEDED,
            type: "no-payment",
            message: ErrorMessages[Common.DEFAULT_LANG]?.SUBSCRIPTION_PURCHASED_WITH_DISCOUNT,
            couponApplied: !!couponId,
            couponId: couponId || null,
            couponCode: couponCode || null,
            stripeCouponId: stripeCouponId || null,
            planName: plan.name || plan._id?.toString() || 'Subscription Plan',
            planId: plan._id,
            planPrice: plan.price,
            discountAmount,
            finalAmount,
            interval: plan.interval,
          }
    };
    
    console.log('[SUBSCRIBE] Payment history data:', {
      amount: paymentHistoryData.amount,
      paymentFor: paymentHistoryData.paymentFor,
      hasPaymentIntent: !!paymentHistoryData.stripePaymentIntentId,
      metadataType: finalAmount > 0 ? 'paid-subscription' : 'free-subscription',
      couponApplied: paymentHistoryData.metaData?.couponApplied || false,
      couponId: paymentHistoryData.couponId || null,
      couponCode: paymentHistoryData.metaData?.couponCode || null,
      stripeCouponId: paymentHistoryData.metaData?.stripeCouponId || null,
      discountAmount: paymentHistoryData.metaData?.discountAmount || 0
    });
    
    await this.paymentHistoryModel.create(paymentHistoryData);
    console.log('[SUBSCRIBE] Payment history created successfully');
    this.logger.log('Payment history record created', { userId, subscriptionId: subscription._id, amount: finalAmount, couponApplied: !!couponId, couponId, couponCode });

    // 📊 SAVE AFFILIATE TRANSACTION RECORD (for destination charges OR 100% coupon with coach)
    // Also create record when finalAmount === 0 (100% coupon) to track the affiliate relationship
    console.log('[SUBSCRIBE] Affiliate transaction check:', {
      coachId,
      finalAmount,
      usedDestinationCharge,
      hasTransferData: !!transferData,
      shouldCreateRecord: !!(coachId && (usedDestinationCharge && transferData || finalAmount === 0))
    });

    if (coachId && (usedDestinationCharge && transferData || finalAmount === 0)) {
      try {
        console.log('[SUBSCRIBE] Saving affiliate transaction record', { finalAmount, usedDestinationCharge });

        // Find affiliate record to get details
        const affiliate = await this.affiliateModel.findOne({
          $or: [
            { coachId: new Types.ObjectId(coachId) },
            { coachId: coachId },
          ],
          isActive: true,
          isDeleted: false,
        });

        console.log('[SUBSCRIBE] Affiliate lookup result:', {
          coachId,
          affiliateFound: !!affiliate,
          affiliateId: affiliate?._id,
          coachPercentage: affiliate?.coachPercentage,
        });

        if (affiliate) {
          const coachPercentage = affiliate.coachPercentage;
          const platformPercentage = 100 - coachPercentage;

          // Get coach's connect account ID (needed for 100% coupon case where transferData is undefined)
          let coachConnectAccountId = transferData?.coachConnectAccountId;
          if (!coachConnectAccountId && finalAmount === 0) {
            // For 100% coupon, fetch coach to get their connect account ID
            const coach = await this.userModel.findById(coachId).lean();
            coachConnectAccountId = coach?.stripeConnectAccountId || '';
            console.log('[SUBSCRIBE] Fetched coach connect account for 100% coupon:', { coachConnectAccountId });
          }

          // For 100% coupon (finalAmount === 0), all monetary values are 0
          // For paid subscriptions, calculate the split based on net after Stripe fees
          let stripeProcessingFee = 0;
          let netAfterStripeFee = 0;
          let coachShareOfNet = 0;
          let platformShareOfNet = 0;
          let platformCollectedFee = 0;

          if (finalAmount > 0) {
            const stripeFeePercent = 2.9;
            const stripeFixedFee = 0.30;

            // Calculate all the breakdown values
            stripeProcessingFee = (finalAmount * stripeFeePercent / 100) + stripeFixedFee;
            netAfterStripeFee = finalAmount - stripeProcessingFee;
            coachShareOfNet = netAfterStripeFee * coachPercentage / 100;
            platformShareOfNet = netAfterStripeFee - coachShareOfNet;

            // Platform collected fee (application fee)
            platformCollectedFee = finalAmount - coachShareOfNet;
          }

          const affiliateTransactionData = {
            transactionType: AffiliateTransactionType.SUBSCRIPTION_INITIAL,
            status: AffiliateTransactionStatus.COMPLETED,
            clientId: new Types.ObjectId(userId),
            coachId: new Types.ObjectId(coachId),
            affiliateId: affiliate._id,
            subscriptionId: subscription._id,
            subscriptionPlanId: new Types.ObjectId(planId),

            // Platform View Breakdown
            platformView: {
              paymentAmount: finalAmount,
              stripeProcessingFee: Math.round(stripeProcessingFee * 100) / 100,
              netAmount: Math.round(netAfterStripeFee * 100) / 100,
              collectedFee: Math.round(platformCollectedFee * 100) / 100,
              currency: plan.currency || 'eur',
            },

            // Coach View Breakdown (amounts before Stripe Connect fees)
            coachView: {
              grossAmountOriginal: finalAmount,
              originalCurrency: plan.currency || 'eur',
              totalFees: Math.round(platformCollectedFee * 100) / 100, // Total deducted from coach
              netAmount: Math.round(coachShareOfNet * 100) / 100,
              netCurrency: plan.currency || 'eur',
              applicationFee: Math.round(platformCollectedFee * 100) / 100,
            },

            // Split Calculation Details
            splitCalculation: {
              coachPercentage,
              platformPercentage,
              grossAmount: finalAmount,
              stripeProcessingFee: Math.round(stripeProcessingFee * 100) / 100,
              netAfterStripeFee: Math.round(netAfterStripeFee * 100) / 100,
              coachShareOfNet: Math.round(coachShareOfNet * 100) / 100,
              platformShareOfNet: Math.round(platformShareOfNet * 100) / 100,
              applicationFeePercent: transferData?.applicationFeePercent || 0,
            },

            // Stripe References
            stripePaymentIntentId: paymentIntent?.id || null,
            stripeChargeId: typeof paymentIntent?.latest_charge === 'string'
              ? paymentIntent.latest_charge
              : paymentIntent?.latest_charge?.id || null,
            stripeInvoiceId: invoice?.id,
            stripeSubscriptionId: stripeSub.id,
            coachConnectAccountId: coachConnectAccountId,
            usedDestinationCharge: usedDestinationCharge && finalAmount > 0,


            // Coupon details (for any coupon transaction)
            ...(couponId && {
              couponApplied: true,
              couponId: new Types.ObjectId(couponId),
              couponCode: couponCode || null,
              couponDiscountAmount: discountAmount,
              couponDiscountValue: discountAmount,
            }),

            // Mark as 100% coupon (no-cost) transaction when applicable
            ...(finalAmount === 0 && {
              noCostTransaction: true,
            }),

            paymentDate: new Date(),
            billingPeriodStart: new Date(stripeSub.current_period_start * 1000),
            billingPeriodEnd: new Date(stripeSub.current_period_end * 1000),

            description: finalAmount === 0
              ? `Initial subscription (100% coupon) - ${plan.name || 'Subscription'} - Coach: ${coachPercentage}%`
              : `Initial subscription payment - ${plan.name || 'Subscription'} - Coach: ${coachPercentage}%`,
          };

          await this.affiliateTransactionModel.create(affiliateTransactionData);
          console.log('[SUBSCRIBE] Affiliate transaction record saved successfully', { finalAmount, coachShareOfNet });
          this.logger.log('Affiliate transaction record created', {
            subscriptionId: subscription._id,
            coachId,
            coachPercentage,
            coachShareOfNet: Math.round(coachShareOfNet * 100) / 100,
            noCostTransaction: finalAmount === 0,
          });
        }
      } catch (affiliateTransactionError) {
        // Log error but don't fail - the payment was successful
        console.error('[SUBSCRIBE] Error saving affiliate transaction record:', affiliateTransactionError);
      }
    }

    // 💰 COACH AFFILIATE PAYMENT SPLIT (Fallback to separate transfer only if destination charge wasn't used)
    // If usedDestinationCharge is true, Stripe handles the split automatically via transfer_data
    if (coachId && finalAmount > 0 && !usedDestinationCharge) {
      console.log('[SUBSCRIBE] Processing coach affiliate payment split via SEPARATE TRANSFER for coachId:', coachId);
      try {
        // Find affiliate record to get coach percentage
        // Query both ObjectId and string formats since data may be stored either way
        const affiliate = await this.affiliateModel.findOne({
          $or: [
            { coachId: new Types.ObjectId(coachId) },
            { coachId: coachId }, // Also match if stored as string
          ],
          isActive: true,
          isDeleted: false,
        });

        if (affiliate) {
          console.log('[SUBSCRIBE] Found affiliate record:', {
            coachId: affiliate.coachId,
            coachPercentage: affiliate.coachPercentage,
          });

          // Find coach to get their Stripe Connect account ID
          const coach = await this.userModel.findById(coachId).lean();

          if (coach && coach.stripeConnectAccountId && coach.stripeConnectOnboardingComplete) {
            // Calculate amount after Stripe fee (approximately 2.9% + 30 cents for USD)
            const amountPaidCents = Math.round(finalAmount * 100); // Convert to cents
            const stripeFeePercent = 2.9;
            const stripeFixedFee = 30; // 30 cents
            const stripeFee = Math.round((amountPaidCents * stripeFeePercent) / 100) + stripeFixedFee;
            const amountAfterStripeFee = amountPaidCents - stripeFee;

            // Calculate coach share based on affiliate percentage
            const coachShareAmount = Math.round((amountAfterStripeFee * affiliate.coachPercentage) / 100);
            const platformShareAmount = amountAfterStripeFee - coachShareAmount;

            console.log('[SUBSCRIBE] Payment split calculation:', {
              amountPaidCents,
              stripeFee,
              amountAfterStripeFee,
              coachPercentage: affiliate.coachPercentage,
              coachShareAmount,
              platformShareAmount,
              coachConnectAccountId: coach.stripeConnectAccountId,
            });

            // Only transfer if coach share is greater than 0
            if (coachShareAmount > 0) {
              // Get the charge ID from the payment intent to use as source_transaction
              // This allows the transfer to proceed even before funds settle
              const chargeId = typeof paymentIntent?.latest_charge === 'string'
                ? paymentIntent.latest_charge
                : paymentIntent?.latest_charge?.id;

              console.log('[SUBSCRIBE] Using charge ID for source_transaction:', chargeId);

              const transferResult = await this.stripeService.createTransferToCoach(
                coach.stripeConnectAccountId,
                coachShareAmount,
                subscription.currency || 'eur',
                `Subscription affiliate share for ${subscription._id}`,
                {
                  subscriptionId: subscription._id.toString(),
                  coachId: coachId.toString(),
                  coachPercentage: affiliate.coachPercentage.toString(),
                  amountPaid: amountPaidCents.toString(),
                  stripeFee: stripeFee.toString(),
                },
                chargeId, // Pass charge ID as source_transaction
              );
              console.log('[SUBSCRIBE] Coach payment transfer successful:', transferResult);
              this.logger.log('Coach affiliate payment transfer completed', {
                coachId,
                coachShareAmount,
                transferId: transferResult?.transferId,
              });
            } else {
              console.log('[SUBSCRIBE] Coach share is 0, skipping transfer');
            }
          } else {
            console.log('[SUBSCRIBE] Coach not eligible for payment split:', {
              coachId,
              hasConnectAccountId: !!coach?.stripeConnectAccountId,
              onboardingComplete: coach?.stripeConnectOnboardingComplete,
            });
          }
        } else {
          console.log('[SUBSCRIBE] No active affiliate record found for coach:', coachId);
        }
      } catch (splitError) {
        // Log error but don't fail the subscription - payment was still successful
        console.error('[SUBSCRIBE] Error processing coach affiliate payment split:', splitError);
        this.logger.error('Coach affiliate payment split failed', {
          coachId,
          subscriptionId: subscription._id,
          error: splitError instanceof Error ? splitError.message : 'Unknown error',
        });
      }
    } else if (usedDestinationCharge) {
      console.log('[SUBSCRIBE] Coach affiliate payment handled via DESTINATION CHARGE - Stripe handles transfer automatically');
    }

    //SEND CONFIRMATION EMAIL
    console.log('[SUBSCRIBE] Preparing to send confirmation email');
    
    try {
      // Get company details for email
      let company: any = null;
      if (user.companyId) {
        console.log(' [SUBSCRIBE] Fetching company details for email:', user.companyId);
        company = await this.companyModel.findById(user.companyId);
        console.log('[SUBSCRIBE] Company details:', {
          companyFound: !!company,
          companyName: company?.companyName
        });
      }

      // Prepare included content list for email
      const includedContent: string[] = [];
      if (plan.includedCourses?.length) {
        includedContent.push(`${plan.includedCourses.length} Course(s)`);
      }
      if (plan.includedAssessments?.length) {
        includedContent.push(`${plan.includedAssessments.length} Assessment(s)`);
      }
      if (plan.includedBundles?.length) {
        includedContent.push(`${plan.includedBundles.length} Bundle(s)`);
      }
      if ((plan as any).includedAppointments?.length) {
        includedContent.push(`${(plan as any).includedAppointments.length} Appointment Type(s)`);
      }

      console.log('[SUBSCRIBE] Included content for email:', includedContent);

      // Helper function to get currency symbol
      const getCurrencySymbol = (currencyCode: string): string => {
        const symbols: { [key: string]: string } = {
          'usd': '$',
          'eur': '€',
          'gbp': '£',
          'cad': 'C$',
          'aud': 'A$',
          'jpy': '¥',
          'chf': 'CHF ',
          'sek': 'kr',
          'nok': 'kr',
          'dkk': 'kr',
          'inr': '₹',
        };
        return symbols[currencyCode.toLowerCase()] || currencyCode.toUpperCase() + ' ';
      };

      // Format amount with proper currency symbol - use actual amount paid
      const currency = subscription.currency || 'usd';
      const currencySymbol = getCurrencySymbol(currency);
      const formattedAmount = `${currencySymbol}${subscription.amountPaid ?? 0}`;

      const mailData = {
        user_name: `${user.firstName?.trim() || ''} ${user.lastName?.trim() || ''}`.trim(),
        email: user.email,
        subscription_plan_name: plan.name || 'Premium Plan',
        amount_paid: subscription.amountPaid ?? 0,
        formatted_amount: formattedAmount,
        currency: currency,
        start_date: subscription.startDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        end_date: subscription.endDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        included_content: includedContent,
        company_name: company?.companyName || process.env.COMPANY_NAME || 'Happy Whole Human',
        street_address: company?.address?.streetAddress || '10900 Research Blvd, Suite 160C-2776',
        city: company?.address?.city || 'Austin',
        state: company?.address?.state || 'TX',
        zip_code: company?.address?.zipcode || '78759',
        country: company?.address?.country || 'USA',
        phone: company?.primaryContact?.primaryMobileNumber || '',
        company_email: company?.primaryContact?.primaryEmail || process.env.MAIL_USER || 'support@happywholehuman.com',
      };

      console.log('[SUBSCRIBE] Email data prepared:', {
        recipientEmail: mailData.email,
        userName: mailData.user_name,
        planName: mailData.subscription_plan_name,
        amountPaid: mailData.amount_paid,
        formattedAmount: mailData.formatted_amount,
        startDate: mailData.start_date,
        endDate: mailData.end_date,
        includedContentCount: mailData.included_content.length
      });

      // Send subscription confirmation email
      this.emailService.sendMailTemplate(
        mailData,
        EmailEnums.THANKS_FOR_SUBSCRIPTION_PURCHASED,
        EmailTemplates.SUBSCRIPTION_PURCHASED,
      );
      
      console.log('[SUBSCRIBE] Confirmation email sent successfully');
      this.logger.log('Subscription confirmation email sent successfully', { userId, recipientEmail: mailData.email });
    } catch (emailError) {
      // Log email error but don't fail the subscription
      console.error('[SUBSCRIBE] Failed to send subscription confirmation email:', emailError);
      this.logger.error('Failed to send subscription confirmation email', {
        userId,
        error: emailError instanceof Error ? emailError.message : 'Unknown error'
      });
    }

    // 📬 SEND NOTIFICATIONS TO ADMIN AND PLAN CREATOR
    try {
      if (this.notificationService) {
        console.log(' [SUBSCRIBE] Preparing to send notifications to admin and plan creator');
        
        // Notification for the subscribing user (confirmation)
        await this.notificationService.sendNotification({
          sentBy: new Types.ObjectId(userId), // User initiated the subscription
          sentTo: new Types.ObjectId(userId),
          notificationType: NotificationEvent.SUBSCRIPTION_CONFIRMED,
          title: 'Subscription Confirmed',
          description: `Your subscription to "${plan.name}" plan has been successfully activated.`,
          link: '/subscriptions/active',
          isRead: false,
          isDeleted: false,
        });
        
        console.log('[SUBSCRIBE] Notification sent to user');
        this.logger.log('Subscription notification sent to user', { userId, planId });

        // Notification for admin (new subscription)
        const adminUsers = await this.userModel.find({
          $or: [
            { role: 'admin' },
            { role: 'superadmin' }
          ]
        }).select('_id');

        if (adminUsers.length > 0) {
          for (const adminUser of adminUsers) {
            await this.notificationService.sendNotification({
              sentBy: new Types.ObjectId(userId), // User who initiated the subscription
              sentTo: adminUser._id,
              notificationType: NotificationEvent.NEW_SUBSCRIPTION,
              title: 'New Subscription',
              description: `${user.firstName} ${user.lastName} has subscribed to "${plan.name}" plan for $${finalAmount ?? 0} ${(subscription.currency || 'usd').toUpperCase()}.`,
              link: `/admin/subscriptions/${subscription._id}`,
              isRead: false,
              isDeleted: false,
            });
          }
          console.log(`[SUBSCRIBE] Notifications sent to ${adminUsers.length} admin(s)`);
          this.logger.log('Subscription notifications sent to admins', { planId, adminCount: adminUsers.length });
        }

        // Notification for plan creator (if exists and is different from admin)
        if (plan.createdBy) {
          const planCreator = await this.userModel.findById(plan.createdBy);
          if (planCreator) {
            await this.notificationService.sendNotification({
              sentBy: new Types.ObjectId(userId), // User who initiated the subscription
              sentTo: plan.createdBy,
              notificationType: NotificationEvent.PLAN_SUBSCRIPTION,
              title: 'Plan Subscription Received',
              description: `${user.firstName} ${user.lastName} has subscribed to your "${plan.name}" plan for $${finalAmount ?? 0} ${(subscription.currency || 'usd').toUpperCase()}.`,
              link: `/admin/subscriptions/${subscription._id}`,
              isRead: false,
              isDeleted: false,
            });
            console.log('[SUBSCRIBE] Notification sent to plan creator');
            this.logger.log('Subscription notification sent to plan creator', { planId, createdBy: plan.createdBy });
          }
        }
      }
    } catch (notificationError) {
      // Log notification error but don't fail the subscription
      console.error('[SUBSCRIBE] Failed to send notifications:', notificationError);
      this.logger.error('Failed to send subscription notifications', {
        userId,
        planId,
        error: notificationError instanceof Error ? notificationError.message : 'Unknown error'
      });
    }

    // 7️⃣ GRANT ALL INCLUDED ITEMS
    console.log('[SUBSCRIBE] Granting subscription content to user');
    console.log('[SUBSCRIBE] Content to grant:', {
      courses: plan.includedCourses?.length || 0,
      assessments: plan.includedAssessments?.length || 0,
      bundles: plan.includedBundles?.length || 0,
      appointments: (plan as any).includedAppointments?.length || 0
    });
    
    await this.grantSubscriptionContent(
      new Types.ObjectId(subscriptionTargetUserId),
      plan,
      subscription._id,
    );

    console.log('[SUBSCRIBE] Subscription content granted successfully');
    this.logger.log('Subscription content granted successfully', {
      subscriptionTargetUserId,
      subscriptionId: subscription._id,
      coursesGranted: plan.includedCourses?.length || 0,
      assessmentsGranted: plan.includedAssessments?.length || 0,
      bundlesGranted: plan.includedBundles?.length || 0,
      appointmentsGranted: (plan as any).includedAppointments?.length || 0
    });

    // 8️⃣ COUPLE PLAN: GRANT ACCESS TO PARTNER
    try {
      const partnerId = await this.getPartnerIdForCouplePlan(
        new Types.ObjectId(subscriptionTargetUserId),
        plan,
      );
      if (partnerId) {
        console.log('[SUBSCRIBE] Couple plan detected, granting access to partner:', partnerId.toString());
        await this.grantCouplePartnerAccess(
          partnerId,
          new Types.ObjectId(subscriptionTargetUserId),
          plan,
          subscription,
        );
        console.log('[SUBSCRIBE] Partner access granted successfully');
      }
    } catch (coupleError) {
      console.error('[SUBSCRIBE] Error granting couple partner access:', coupleError);
      this.logger.error('Failed to grant couple partner access', {
        userId: subscriptionTargetUserId,
        planId,
        error: coupleError instanceof Error ? coupleError.message : 'Unknown error',
      });
    }

    const finalResult = {
      status: finalAmount === 0 ? PaymentStatus.SUCCEEDED : (paymentIntent?.status),
      clientSecret: paymentIntent?.client_secret,
      discountAmount,
      finalAmount,
      stripeCouponId: stripeCouponId,
      subscriptionId: subscription._id,
    };
    
    console.log('[SUBSCRIBE] Subscription process completed successfully:', {
      subscriptionId: finalResult.subscriptionId,
      status: finalResult.status,
      finalAmount: finalResult.finalAmount,
      discountAmount: finalResult.discountAmount,
      hasClientSecret: !!finalResult.clientSecret,
      hasCoupon: !!finalResult.stripeCouponId
    });

    this.logger.log('Subscription process completed successfully', {
      userId,
      subscriptionId: finalResult.subscriptionId,
      status: finalResult.status,
      finalAmount: finalResult.finalAmount,
      planName: plan.name
    });

    return finalResult;
  } catch (error) {
    console.error(' [SUBSCRIBE] Subscription process failed:', {
      errorName: error.constructor.name,
      errorMessage: error.message,
      statusCode: error.statusCode || error.status,
      userId,
      planId: dto.planId
    });

    this.logger.error('Subscription process failed', {
      userId,
      planId: dto.planId,
      errorName: error.constructor.name,
      errorMessage: error.message,
      statusCode: error.statusCode || error.status,
      stack: error.stack
    });
    
    if (error instanceof RpcException || error instanceof BadRequestException) {
      throw error;
    }

    throw new InternalServerErrorException(
      error?.message || 'Subscription failed',
    );
  }
}

  // USER/ADMIN – UPGRADE SUBSCRIPTION WITH PRORATED BILLING
  async upgradeSubscription(userId: string, dto: any, loginUser?: any) {
    try {
      const { newPlanId, paymentMethodId, couponCode, clientId } = dto;
      const targetUserId = clientId || userId; // Admin can upgrade for client
      const isAdminUpgrade = clientId && clientId !== userId;

      if (!newPlanId) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.NEWPLANID_REQUIRED);
      }

      if (!Types.ObjectId.isValid(newPlanId)) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_NEWPLANID);
      }

      // 2️⃣ Get new plan details (fetch first to match subscription by userType)
      const newPlan = await this.planModel.findById(newPlanId);
      if (!newPlan || !newPlan.isActive) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_NEW_PLAN);
      }

      const newPlanUserType = (newPlan.userType || '').toString().trim().toLowerCase();

      // 1️⃣ Find current active subscription matching the same userType as the new plan
      // This ensures upgrading a couple plan only affects the couple subscription,
      // and upgrading an individual plan only affects the individual subscription.
      const activeSubscriptions = await this.subscriptionModel
        .find({
          userId: new Types.ObjectId(targetUserId),
          status: { $in: ['active', 'past_due'] }
        })
        .populate('planId')
        .sort({ createdAt: -1 });

      const currentSubscription = activeSubscriptions.find((sub) => {
        const subPlan = sub.planId as any;
        const subPlanUserType = (subPlan?.userType || '').toString().trim().toLowerCase();
        return subPlanUserType === newPlanUserType;
      });

      if (!currentSubscription) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.NO_ACTIVE_SUBSCRIPTION_TO_UPGRADE);
      }

      // 3️⃣ Check if it's actually an upgrade (prevent downgrade or same plan)
      const currentPlan = currentSubscription.planId as any;
      if (currentPlan._id.toString() === newPlanId.toString()) {
        throw new BadRequestException(
          isAdminUpgrade 
            ? `This user is already subscribed to "${currentPlan.name}" plan.`
            : ErrorMessages[Common.DEFAULT_LANG]?.ALREADY_SUBSCRIBED_TO_PLAN
        );
      }

      // Simple upgrade validation: new plan price should be higher
      if (newPlan.price <= currentPlan.price) {
        throw new BadRequestException(
          isAdminUpgrade
            ? `Cannot upgrade to "${newPlan.name}" (${newPlan.currency} ${newPlan.price}). The new plan must have a higher price than the current plan "${currentPlan.name}" (${currentPlan.currency} ${currentPlan.price}).`
            : ErrorMessages[Common.DEFAULT_LANG]?.NEW_PLAN_MUST_BE_HIGHER_PRICE
        );
      }

      // 4️⃣ Get user and stripe customer
      const user = await this.userModel.findById(targetUserId);
      if (!user) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.USER_NOT_FOUND);
      }

      const stripe = this.stripeService.getClient();
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.NO_STRIPE_CUSTOMER);
      }

      // Verify existing customer exists in Stripe
      let needsNewSubscription = false;
      try {
        await stripe.customers.retrieve(customerId);
      } catch (error: any) {
        if (error.code === 'resource_missing') {
          // Customer doesn't exist in Stripe, clear invalid ID and create new one
          console.log(`Stripe customer ${customerId} not found for upgrade, creating new customer for user ${userId}`);
          const newCustomer = await stripe.customers.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          });
          customerId = newCustomer.id;
          user.stripeCustomerId = customerId;
          await user.save();
          console.log(`Created new Stripe customer ${customerId} for user ${userId} during upgrade`);
          // When customer is recreated, old subscription is invalid - we need to create a new one
          needsNewSubscription = true;
        } else {
          throw error;
        }
      }

      // Also verify the Stripe subscription exists (it may be missing if customer was recreated or data is stale)
      if (!needsNewSubscription && currentSubscription.stripeSubscriptionId) {
        try {
          await stripe.subscriptions.retrieve(currentSubscription.stripeSubscriptionId);
        } catch (subError: any) {
          if (subError.code === 'resource_missing') {
            console.log(`Stripe subscription ${currentSubscription.stripeSubscriptionId} not found for upgrade, will create new subscription`);
            needsNewSubscription = true;
          } else {
            throw subError;
          }
        }
      }

      // 5️⃣ Handle coupon validation (similar to subscribe method)
      let discountAmount = 0;
      let couponId: string | undefined;
      let stripeCouponId: string | undefined;
      let finalAmount = newPlan.price;

      if (couponCode) {
        const nowUtcIso = await formatDate(new Date());
        const couponDetails = await this.couponService.getByAttributes(
          {
            couponCode,
            isDeleted: false,
            isActive: true,
            expirationDate: { $gte: new Date(nowUtcIso) },
          },
          { langCode: 'en' } as any,
        );

        // Validate coupon category
        const couponCategory = await this.globalCodeModel.findOne({
          _id: couponDetails.couponCategory,
          isDeleted: false,
          isActive: true
        });

        if (!couponCategory || couponCategory.value !== 'subscription') {
          throw new RpcException({
            statusCode: StatusCodeEnum.BAD_REQUEST,
            message: ErrorMessages.en.INVALID_COUPON,
          });
        }

        // Calculate discount
        const { discountTypeName, discountValue } = couponDetails;
        if (discountTypeName === CouponType.PERCENTAGE) {
          discountAmount = parseFloat(((newPlan.price * discountValue) / 100).toFixed(2));
        } else if (discountTypeName === CouponType.PRICE) {
          discountAmount = discountValue;
        }
        
        finalAmount = Math.max(0, parseFloat((newPlan.price - discountAmount).toFixed(2)));
        couponId = couponDetails._id.toString();

        try {
          stripeCouponId = await this.stripeService.getOrCreateStripeCoupon(
            couponCode,
            discountTypeName === CouponType.PERCENTAGE ? 'percentage' : 'amount',
            discountValue,
            discountTypeName === CouponType.PRICE ? (newPlan.currency || 'usd') : undefined
          );
        } catch (stripeError: any) {
          console.error('Failed to create/get Stripe coupon:', stripeError);
          throw new RpcException({
            statusCode: StatusCodeEnum.INTERNAL_SERVER_ERROR,
            message: ErrorMessages[Common.DEFAULT_LANG]?.FAILED_TO_APPLY_COUPON,
          });
        }
      }

      // 6️⃣ Update payment method if provided
      if (paymentMethodId) {
        try {
          await this.stripeService.attachPaymentMethodToCustomer(customerId, paymentMethodId);
        } catch (error: any) {
          const errorCode = error.error?.code || error.code;
          const errorMessage = error.error?.message || error.message;

          // Handle payment method not found (credential change scenario)
          if (errorCode === 'STRIPE_PAYMENT_METHOD_NOT_FOUND' ||
              errorMessage?.includes('payment method is no longer valid')) {
            console.log('💳 [UPGRADE] Payment method not found - Stripe credentials may have changed');
            throw new InternalServerErrorException(
              'Your saved payment method is no longer valid. Please add a new payment method and try again.'
            );
          }

          // Handle customer not found
          if (errorCode === 'STRIPE_CUSTOMER_NOT_FOUND' ||
              errorMessage?.includes('STRIPE_CUSTOMER_NOT_FOUND')) {
            // Customer doesn't exist, recreate and try again
            console.log(`Customer ${customerId} not found during payment method attachment, recreating...`);
            const newCustomer = await stripe.customers.create({
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
            });
            customerId = newCustomer.id;
            user.stripeCustomerId = customerId;
            await user.save();

            // Retry payment method attachment with new customer
            try {
              await this.stripeService.attachPaymentMethodToCustomer(customerId, paymentMethodId);
            } catch (retryError: any) {
              const retryErrorCode = retryError.error?.code || retryError.code;
              if (retryErrorCode === 'STRIPE_PAYMENT_METHOD_NOT_FOUND') {
                throw new InternalServerErrorException(
                  'Your saved payment method is no longer valid. Please add a new payment method and try again.'
                );
              }
              throw retryError;
            }
          } else {
            throw error;
          }
        }
      }

      // 7️⃣ Upgrade or create new Stripe subscription
      let updatedStripeSub: any;
      let priceIdToUse = newPlan.stripePriceId;

      if (needsNewSubscription) {
        // Create a new subscription since the old one doesn't exist in Stripe
        console.log(`[UPGRADE] Creating new Stripe subscription for user ${targetUserId} with price ${priceIdToUse}`);
        try {
          updatedStripeSub = await this.stripeService.createSubscription(
            customerId,
            priceIdToUse,
            stripeCouponId,
          );
        } catch (createSubError: any) {
          // Handle missing price - recreate it (similar to subscribe method)
          if (createSubError.code === 'resource_missing' && createSubError.message?.includes('price')) {
            console.log('[UPGRADE] Stripe price not found, recreating price and product');

            // First, create or get the product
            let product: any;
            try {
              if (newPlan.stripeProductId) {
                console.log('[UPGRADE] Attempting to retrieve existing product:', newPlan.stripeProductId);
                product = await stripe.products.retrieve(newPlan.stripeProductId);
                console.log('[UPGRADE] Product retrieved successfully');
              } else {
                throw new Error('No product ID, need to create new');
              }
            } catch (productError: any) {
              console.log('[UPGRADE] Product not found or error, creating new product:', {
                productError: productError.message,
                planName: newPlan.name
              });

              // Product doesn't exist, create new one
              product = await stripe.products.create({
                name: newPlan.name,
                description: `Subscription plan: ${newPlan.name}`,
              });

              console.log('[UPGRADE] New product created:', { productId: product.id });

              // Update plan with new product ID
              newPlan.stripeProductId = product.id;
              await newPlan.save();
              console.log('[UPGRADE] Plan updated with new product ID');
            }

            console.log('[UPGRADE] Creating new price for product');

            // Create new price
            const newStripePrice = await stripe.prices.create({
              product: product.id,
              unit_amount: Math.round(newPlan.price * 100), // Convert to cents
              currency: newPlan.currency || 'usd',
              recurring: {
                interval: newPlan.interval === 'monthly' ? 'month' : 'year',
              },
            });

            console.log('[UPGRADE] New price created:', {
              priceId: newStripePrice.id,
              unitAmount: newStripePrice.unit_amount,
              currency: newStripePrice.currency,
              interval: newStripePrice.recurring?.interval
            });

            // Update plan with new price ID
            newPlan.stripePriceId = newStripePrice.id;
            await newPlan.save();
            priceIdToUse = newStripePrice.id;
            console.log('[UPGRADE] Plan updated with new price ID');

            // Retry creating subscription with new price
            updatedStripeSub = await this.stripeService.createSubscription(
              customerId,
              priceIdToUse,
              stripeCouponId,
            );
            console.log('[UPGRADE] Subscription created with new price');
          } else {
            throw createSubError;
          }
        }
        console.log(`[UPGRADE] Created new Stripe subscription ${updatedStripeSub.id} for user ${targetUserId}`);
      } else {
        // Upgrade existing subscription with prorated billing
        try {
          updatedStripeSub = await this.stripeService.upgradeSubscription(
            currentSubscription.stripeSubscriptionId,
            priceIdToUse,
            stripeCouponId,
          );
        } catch (upgradeError: any) {
          // Handle missing price - recreate it
          if (upgradeError.code === 'resource_missing' && upgradeError.message?.includes('price')) {
            console.log('[UPGRADE] Stripe price not found during upgrade, recreating price and product');

            // First, create or get the product
            let product: any;
            try {
              if (newPlan.stripeProductId) {
                console.log('[UPGRADE] Attempting to retrieve existing product:', newPlan.stripeProductId);
                product = await stripe.products.retrieve(newPlan.stripeProductId);
                console.log('[UPGRADE] Product retrieved successfully');
              } else {
                throw new Error('No product ID, need to create new');
              }
            } catch (productError: any) {
              console.log('[UPGRADE] Product not found or error, creating new product:', {
                productError: productError.message,
                planName: newPlan.name
              });

              // Product doesn't exist, create new one
              product = await stripe.products.create({
                name: newPlan.name,
                description: `Subscription plan: ${newPlan.name}`,
              });

              console.log('[UPGRADE] New product created:', { productId: product.id });

              // Update plan with new product ID
              newPlan.stripeProductId = product.id;
              await newPlan.save();
              console.log('[UPGRADE] Plan updated with new product ID');
            }

            console.log('[UPGRADE] Creating new price for product');

            // Create new price
            const newStripePrice = await stripe.prices.create({
              product: product.id,
              unit_amount: Math.round(newPlan.price * 100), // Convert to cents
              currency: newPlan.currency || 'usd',
              recurring: {
                interval: newPlan.interval === 'monthly' ? 'month' : 'year',
              },
            });

            console.log('[UPGRADE] New price created:', {
              priceId: newStripePrice.id,
              unitAmount: newStripePrice.unit_amount,
              currency: newStripePrice.currency,
              interval: newStripePrice.recurring?.interval
            });

            // Update plan with new price ID
            newPlan.stripePriceId = newStripePrice.id;
            await newPlan.save();
            priceIdToUse = newStripePrice.id;
            console.log('[UPGRADE] Plan updated with new price ID');

            // Retry upgrade with new price
            updatedStripeSub = await this.stripeService.upgradeSubscription(
              currentSubscription.stripeSubscriptionId,
              priceIdToUse,
              stripeCouponId,
            );
            console.log('[UPGRADE] Subscription upgraded with new price');
          } else {
            throw upgradeError;
          }
        }
      }

      const invoice: any = updatedStripeSub.latest_invoice;
      const paymentIntent = invoice?.payment_intent;

      // 8️⃣ Update subscription in database
      const updateData: any = {
        planId: new Types.ObjectId(newPlanId),
        stripeInvoiceId: invoice?.id,
        stripePaymentIntentId: paymentIntent?.id,
        amountPaid: finalAmount,
        currency: newPlan.currency || 'usd',
        paymentStatus: finalAmount === 0 ? PaymentStatus.SUCCEEDED : (paymentIntent?.status ?? PaymentStatus.PENDING),
        endDate: new Date((updatedStripeSub as any).current_period_end * 1000),
        couponId: couponId ? new Types.ObjectId(couponId) : undefined,
        stripeCouponId: stripeCouponId,
        discountAmount,
        appointmentAllowances: Array.isArray((newPlan as any).includedAppointments)
          ? (newPlan as any).includedAppointments.map((a: any) => ({
              appointmentTypeId: a.appointmentTypeId,
              remaining: a.limit,
              limit: a.limit,
            }))
          : [],
      };

      // Update stripeSubscriptionId if a new subscription was created
      if (needsNewSubscription) {
        updateData.stripeSubscriptionId = updatedStripeSub.id;
        console.log(`[UPGRADE] Updating stripeSubscriptionId to ${updatedStripeSub.id}`);
      }

      // Add upgradedBy field for tracking
      if (isAdminUpgrade && loginUser) {
        const adminId = loginUser._id || loginUser.userId || userId;
        updateData.upgradedBy = new Types.ObjectId(adminId);
        console.log('[UPGRADE] Added upgradedBy:', adminId);
      }

      const updatedSubscription = await this.subscriptionModel.findByIdAndUpdate(
        currentSubscription._id,
        updateData,
        { new: true }
      );

      if (!updatedSubscription) {
        throw new InternalServerErrorException(ErrorMessages[Common.DEFAULT_LANG]?.FAILED_TO_UPDATE_SUBSCRIPTION);
      }

      // 🆕 CREATE PAYMENT HISTORY FOR UPGRADE
      await this.paymentHistoryModel.create({
        paidBy: new Types.ObjectId(targetUserId), // Always show user's name in transaction history
        subscriptionId: updatedSubscription._id,
        amount: finalAmount,
        paymentFor: PaymentFor.SUBSCRIPTION,
        stripePaymentIntentId: finalAmount > 0 ? paymentIntent?.id || '' : '',
        paymentDate: new Date(),
        metaData: finalAmount > 0
          ? {
              subscriptionId: updatedStripeSub.id,
              invoiceId: invoice?.id,
              paymentIntentId: paymentIntent?.id,
              planName: newPlan.name || newPlan._id?.toString() || 'New Subscription Plan',
              oldPlanName: currentPlan.name || currentPlan._id?.toString() || 'Previous Plan',
              planId: newPlan._id,
              oldPlanId: currentPlan._id,
              planPrice: newPlan.price,
              oldPlanPrice: currentPlan.price,
              discountAmount,
              finalAmount,
              status: paymentIntent?.status || PaymentStatus.SUCCEEDED,
              type: 'subscription-upgrade',
              interval: newPlan.interval,
              isUpgrade: true,
            }
          : {
              status: PaymentStatus.SUCCEEDED,
              type: "no-payment-upgrade",
              message: ErrorMessages[Common.DEFAULT_LANG]?.SUBSCRIPTION_UPGRADE_WITH_DISCOUNT,
              couponApplied: couponId || null,
              planName: newPlan.name || newPlan._id?.toString() || 'New Subscription Plan',
              oldPlanName: currentPlan.name || currentPlan._id?.toString() || 'Previous Plan',
              planId: newPlan._id,
              oldPlanId: currentPlan._id,
              planPrice: newPlan.price,
              oldPlanPrice: currentPlan.price,
              discountAmount,
              finalAmount,
              interval: newPlan.interval,
              isUpgrade: true,
            }
      });

      // 9️⃣ Grant new subscription content
      await this.grantSubscriptionContent(
        new Types.ObjectId(targetUserId),
        newPlan,
        updatedSubscription._id,
      );

      // 9️⃣.5 COUPLE PLAN: Upgrade partner's subscription too
      try {
        // Check if the new plan is a couple plan
        const partnerId = await this.getPartnerIdForCouplePlan(
          new Types.ObjectId(targetUserId),
          newPlan,
        );

        if (partnerId) {
          this.logger.log(`[UPGRADE] Couple plan detected, upgrading subscription for partner ${partnerId}`);

          // Cancel/update partner's old subscription from the previous plan
          const partnerOldSubscription = await this.subscriptionModel.findOne({
            userId: partnerId,
            planId: currentPlan._id,
            status: { $in: ['active', 'past_due'] },
          });

          if (partnerOldSubscription) {
            await this.subscriptionModel.findByIdAndUpdate(
              partnerOldSubscription._id,
              { status: 'upgraded', endDate: new Date() },
            );
            this.logger.log(`[UPGRADE] Cancelled partner's old subscription ${partnerOldSubscription._id}`);
          }

          // Grant partner access to the new upgraded plan
          await this.grantCouplePartnerAccess(
            partnerId,
            new Types.ObjectId(targetUserId),
            newPlan,
            updatedSubscription,
          );

          this.logger.log(`[UPGRADE] Partner ${partnerId} subscription upgraded to new plan "${newPlan.name}"`);
        }
      } catch (coupleError) {
        this.logger.error('Failed to grant couple partner access during upgrade', {
          userId: targetUserId,
          error: coupleError instanceof Error ? coupleError.message : 'Unknown error',
        });
      }

      // 🔟 Send upgrade confirmation email
      try {
        let company: any = null;
        if (user.companyId) {
          company = await this.companyModel.findById(user.companyId);
        }

        const includedContent: string[] = [];
        if (newPlan.includedCourses?.length) {
          includedContent.push(`${newPlan.includedCourses.length} Course(s)`);
        }
        if (newPlan.includedAssessments?.length) {
          includedContent.push(`${newPlan.includedAssessments.length} Assessment(s)`);
        }
        if (newPlan.includedBundles?.length) {
          includedContent.push(`${newPlan.includedBundles.length} Bundle(s)`);
        }
        if ((newPlan as any).includedAppointments?.length) {
          includedContent.push(`${(newPlan as any).includedAppointments.length} Appointment Type(s)`);
        }

        const getCurrencySymbol = (currencyCode: string): string => {
          const symbols: { [key: string]: string } = {
            'usd': '$', 'eur': '€', 'gbp': '£', 'cad': 'C$', 'aud': 'A$', 
            'jpy': '¥', 'chf': 'CHF ', 'sek': 'kr', 'nok': 'kr', 'dkk': 'kr', 'inr': '₹',
          };
          return symbols[currencyCode.toLowerCase()] || currencyCode.toUpperCase() + ' ';
        };

        const currency = updatedSubscription.currency || 'usd';
        const currencySymbol = getCurrencySymbol(currency);
        const formattedAmount = `${currencySymbol}${updatedSubscription.amountPaid ?? 0}`;

        const mailData = {
          user_name: `${user.firstName?.trim() || ''} ${user.lastName?.trim() || ''}`.trim(),
          email: user.email,
          subscription_plan_name: newPlan.name || 'Premium Plan',
          old_plan_name: currentPlan.name || 'Previous Plan',
          amount_paid: updatedSubscription.amountPaid ?? 0,
          formatted_amount: formattedAmount,
          currency: currency,
          start_date: updatedSubscription.startDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }),
          end_date: updatedSubscription.endDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }),
          included_content: includedContent,
          company_name: company?.companyName || process.env.COMPANY_NAME || 'Happy Whole Human',
          company_email: company?.primaryContact?.primaryEmail || process.env.MAIL_USER || 'support@happywholehuman.com',
        };

        // Send upgrade confirmation email (using existing template for now)
        this.emailService.sendMailTemplate(
          mailData,
          EmailEnums.THANKS_FOR_SUBSCRIPTION_PURCHASED,
          EmailTemplates.SUBSCRIPTION_PURCHASED,
        );
      } catch (emailError) {
        console.error('Failed to send upgrade confirmation email:', emailError);
      }

      // 📬 SEND NOTIFICATIONS FOR UPGRADE TO ADMIN AND PLAN CREATOR
      try {
        if (this.notificationService) {
          console.log(' [UPGRADE] Preparing to send upgrade notifications to admin and plan creator');
          
          // Notification for the upgrading user
          await this.notificationService.sendNotification({
            sentBy: new Types.ObjectId(isAdminUpgrade ? userId : targetUserId),
            sentTo: new Types.ObjectId(targetUserId),
            notificationType: NotificationEvent.SUBSCRIPTION_UPGRADED,
            title: 'Subscription Upgraded',
            description: isAdminUpgrade 
              ? `Your subscription has been upgraded from "${currentPlan.name}" to "${newPlan.name}" plan by admin.`
              : `Your subscription has been successfully upgraded from "${currentPlan.name}" to "${newPlan.name}" plan.`,
            link: '/subscriptions/active',
            isRead: false,
            isDeleted: false,
          });
          
          console.log('[UPGRADE] Notification sent to user');

          // Notification for admin (subscription upgrade)
          const adminUsers = await this.userModel.find({
            $or: [
              { role: 'admin' },
              { role: 'superadmin' }
            ]
          }).select('_id');

          if (adminUsers.length > 0) {
            for (const adminUser of adminUsers) {
              await this.notificationService.sendNotification({
                sentBy: new Types.ObjectId(isAdminUpgrade ? userId : targetUserId),
                sentTo: adminUser._id,
                notificationType: NotificationEvent.SUBSCRIPTION_UPGRADED,
                title: 'Subscription Upgraded',
                description: isAdminUpgrade
                  ? `Admin upgraded ${user.firstName} ${user.lastName}'s subscription from "${currentPlan.name}" to "${newPlan.name}".`
                  : `${user.firstName} ${user.lastName} has upgraded subscription from "${currentPlan.name}" to "${newPlan.name}".`,
                link: `/admin/subscriptions/${updatedSubscription._id}`,
                isRead: false,
                isDeleted: false,
              });
            }
            console.log(`[UPGRADE] Notifications sent to ${adminUsers.length} admin(s)`);
          }

          // Notification for new plan creator
          if (newPlan.createdBy) {
            const planCreator = await this.userModel.findById(newPlan.createdBy);
            if (planCreator) {
              await this.notificationService.sendNotification({
                sentBy: new Types.ObjectId(isAdminUpgrade ? userId : targetUserId),
                sentTo: newPlan.createdBy,
                notificationType: NotificationEvent.PLAN_SUBSCRIPTION_UPGRADED,
                title: 'Plan Subscription Upgraded',
                description: isAdminUpgrade
                  ? `Admin upgraded ${user.firstName} ${user.lastName} to your "${newPlan.name}" plan.`
                  : `${user.firstName} ${user.lastName} has upgraded to your "${newPlan.name}" plan.`,
                link: `/admin/subscriptions/${updatedSubscription._id}`,
                isRead: false,
                isDeleted: false,
              });
              console.log('[UPGRADE] Notification sent to new plan creator');
            }
          }
        }
      } catch (notificationError) {
        console.error('[UPGRADE] Failed to send upgrade notifications:', notificationError);
      }

      // Calculate the actual amounts for response using invoice data
      const invoiceAmount = (invoice?.amount_paid || paymentIntent?.amount || 0) / 100;
      
      // Try to get proration details from invoice line items
      let actualProratedAmount = invoiceAmount - discountAmount;
      let lineItemDetails: any = null;
      
      if (invoice?.lines?.data) {
        // Look for proration line items
        const prorationCredit = invoice.lines.data.find((line: any) => 
          line.type === 'invoiceitem' && line.proration === true && line.amount < 0
        );
        const upgradeCharge = invoice.lines.data.find((line: any) => 
          line.type === 'subscription' && line.amount > 0
        );
        
        if (prorationCredit && upgradeCharge) {
          const creditAmount = Math.abs(prorationCredit.amount) / 100;
          const chargeAmount = upgradeCharge.amount / 100;
          actualProratedAmount = chargeAmount - creditAmount;
          
          lineItemDetails = {
            creditFromOldPlan: creditAmount,
            chargeForNewPlan: chargeAmount,
            netUpgradeAmount: actualProratedAmount
          };
        }
      }

      const billingData = {
        proratedAmount: actualProratedAmount,
        discountAmount: discountAmount,
        finalAmount: invoiceAmount,
      };

      // Add proration breakdown if available
      if (lineItemDetails) {
        (billingData as any).prorationBreakdown = lineItemDetails;
      }

      const message = isAdminUpgrade
        ? `Subscription has been successfully upgraded from "${currentPlan.name}" to "${newPlan.name}" plan.`
        : `You have successfully upgraded your subscription from "${currentPlan.name}" to "${newPlan.name}" plan.`;

      return {
        message,
        subscription: {
          id: updatedSubscription._id,
          planId: updatedSubscription.planId,
          status: updatedSubscription.status,
          stripeSubscriptionId: updatedSubscription.stripeSubscriptionId,
          stripeInvoiceId: updatedSubscription.stripeInvoiceId,
          stripePaymentIntentId: updatedSubscription.stripePaymentIntentId,
        },
        plan: {
          id: newPlan._id,
          name: newPlan.name,
          price: newPlan.price,
          stripePriceId: newPlan.stripePriceId,
        },
        billing: billingData,
      };

    } catch (error: any) {
      console.log(error, 'upgrade error');
      // Re-throw RpcException as-is
      if (error instanceof RpcException) {
        throw error;
      }
      // Convert HTTP exceptions to RpcException for proper microservice error handling
      if (error instanceof BadRequestException) {
        throw new RpcException({
          statusCode: 400,
          message: error.message,
        });
      }
      if (error instanceof NotFoundException) {
        throw new RpcException({
          statusCode: 404,
          message: error.message,
        });
      }
      if (error instanceof ForbiddenException) {
        throw new RpcException({
          statusCode: 403,
          message: error.message,
        });
      }
      // For Stripe errors, provide a meaningful message
      if (error?.type === 'StripeInvalidRequestError') {
        throw new RpcException({
          statusCode: 400,
          message: error.message || 'Stripe payment error occurred',
        });
      }
      throw new RpcException({
        statusCode: 500,
        message: error?.message || 'Subscription upgrade failed',
      });
    }
  }

  // USER – PREVIEW UPGRADE COST
  async previewUpgrade(userId: string, dto: any) {
    try {
      console.log('Preview upgrade called with:', { userId, dto });
      // Support clientId for admin previewing client upgrades
      const targetUserId = dto.clientId || userId;
      // Get user's current subscription
      const userSubscription = await this.subscriptionModel
        .findOne({ userId: new Types.ObjectId(targetUserId), status: 'active' })
        .populate('planId');

      if (!userSubscription) {
        throw new RpcException({
          statusCode: 404,
          message: ErrorMessages[Common.DEFAULT_LANG]?.NO_ACTIVE_SUBSCRIPTION_FOUND,
        });
      }

      // Get the new plan details
      const newPlan = await this.planModel.findById(dto.newPlanId);
      if (!newPlan) {
        throw new RpcException({
          statusCode: 404,
          message: ErrorMessages[Common.DEFAULT_LANG]?.TARGET_PLAN_NOT_FOUND,
        });
      }

      const currentPlan = userSubscription.planId as any;

      // Check if it's actually an upgrade (new plan is more expensive)
      if (newPlan.price <= currentPlan.price) {
        throw new RpcException({
          statusCode: 400,
          message: ErrorMessages[Common.DEFAULT_LANG]?.CAN_ONLY_UPGRADE_TO_MORE_EXPENSIVE,
        });
      }

      // Calculate prorated billing using Stripe
      let prorationDetails;
      try {
        prorationDetails = await this.stripeService.calculateUpgradeProration(
          userSubscription.stripeSubscriptionId,
          newPlan.stripePriceId,
        );
      } catch (error) {
        console.error('Error calculating proration:', error);
        // Fallback calculation if Stripe fails
        const now = new Date();
        const billingCycleEnd = new Date(userSubscription.endDate);
        const remainingDays = Math.ceil((billingCycleEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        // Use correct divisor based on billing interval (yearly = 365, monthly = 30)
        const billingPeriodDays = currentPlan.interval === 'yearly' ? 365 : 30;
        const dailyCurrentRate = currentPlan.price / billingPeriodDays;
        const dailyNewRate = newPlan.price / billingPeriodDays;
        const remainingCurrentAmount = dailyCurrentRate * remainingDays;
        const newPlanAmount = dailyNewRate * remainingDays;
        const proratedAmount = newPlanAmount - remainingCurrentAmount;

        prorationDetails = {
          proratedAmount: Math.max(0, Math.round(proratedAmount * 100) / 100),
          remainingDays,
          savings: Math.max(0, Math.round((remainingCurrentAmount - newPlanAmount) * 100) / 100)
        };
      }

      return {
        currentPlan: {
          id: currentPlan._id,
          name: currentPlan.name,
          price: currentPlan.price,
          stripePriceId: currentPlan.stripePriceId,
        },
        newPlan: {
          id: newPlan._id,
          name: newPlan.name,
          price: newPlan.price,
          stripePriceId: newPlan.stripePriceId,
        },
        subscription: {
          id: userSubscription._id,
          stripeSubscriptionId: userSubscription.stripeSubscriptionId,
          status: userSubscription.status,
          startDate: userSubscription.startDate,
          endDate: userSubscription.endDate,
        },
        prorationDetails,
        effectiveDate: new Date(),
      };
    } catch (error) {
      console.log(error, 'preview upgrade error');
      // Re-throw RpcException as-is
      if (error instanceof RpcException) {
        throw error;
      }
      // Convert HTTP exceptions to RpcException for proper microservice error handling
      if (error instanceof BadRequestException) {
        throw new RpcException({
          statusCode: 400,
          message: error.message,
        });
      }
      if (error instanceof NotFoundException) {
        throw new RpcException({
          statusCode: 404,
          message: error.message,
        });
      }
      if (error instanceof ForbiddenException) {
        throw new RpcException({
          statusCode: 403,
          message: error.message,
        });
      }
      throw new RpcException({
        statusCode: 500,
        message: ErrorMessages[Common.DEFAULT_LANG]?.FAILED_TO_PREVIEW_UPGRADE_COST,
      });
    }
  }


  // USER – CANCEL (REFUND IF <= 3 DAYS)
  async cancel(userId: string) {
  const stripe = this.stripeService.getClient();

    const subscription = await this.subscriptionModel
      .findOne({ userId, status: 'active' })
      .sort({ createdAt: -1 });

    if (!subscription) {
      throw new ForbiddenException(ErrorMessages[Common.DEFAULT_LANG]?.NO_ACTIVE_SUBSCRIPTION_FOUND);
    }

    const usedDays =
      (Date.now() - subscription.startDate.getTime()) /
      (1000 * 60 * 60 * 24);

    if (usedDays <= 3) {
      const stripeSub = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId,
      );

      const invoiceId = (stripeSub.latest_invoice as unknown) as string;
      if (invoiceId) {
        const invoice = await stripe.invoices.retrieve(invoiceId);
        const paymentIntentId = (invoice as any).payment_intent as string | null;
        if (paymentIntentId) {
          await stripe.refunds.create({
            payment_intent: paymentIntentId,
          });
        }
      }
    }

    // Prefer cancel over del per recent Stripe typings
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    await this.userModel.updateOne(
      { _id: userId },
      {
        subscriptionStatus: 'canceled',
        isSubscriptionAutoRenew: false,
      },
    );

    await this.subscriptionModel.updateOne(
      { _id: subscription._id },
      {
        status: 'canceled',
        canceledAt: new Date(),
      },
    );

    return { message: ResponseMessages[Common.DEFAULT_LANG]?.SUBSCRIPTION_CANCELLED_SUCCESSFULLY };
  }


  // Get subscription totals with coupon validation
  async getSubscriptionTotals(dto: { planId: string; couponCode?: string }, loginUser: any) {
    try {
      const { planId, couponCode } = dto;

      // Validate planId format
      if (!planId || !Types.ObjectId.isValid(planId)) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages.en.INVALID_ID,
        });
      }

      // Fetch plan from database - support both old and new schema formats
      let plan = await this.planModel.findOne({
        _id: new Types.ObjectId(planId),
        $or: [
          { isActive: true },  // New schema
          { isActive: { $exists: false } }  // Old schema without isActive field
        ]
      });

      // If still not found, try without any active filter
      if (!plan) {
        plan = await this.planModel.findById(new Types.ObjectId(planId));
      }

      // Handle plan not found
      if (!plan) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages.en.NOT_FOUND,
        });
      }

      const baseAmount = plan.price;
      let discountAmount = 0;
      let couponId: string | undefined;
      let couponDiscountTypeName: string | undefined;
      let couponDiscountValue: number | undefined;

      // Process coupon if provided
      if (couponCode) {
        // Create a default loginUser object if undefined (for coupon service)
        if (!loginUser) {
          loginUser = {
            langCode: 'en',
            userId: 'anonymous',
            _id: 'anonymous',
            email: 'anonymous@system.local',
            firstName: 'Anonymous',
            lastName: 'User',
          } as any;
        }
        
        const nowUtcIso = await formatDate(new Date());

        try {
          const couponDetails = await this.couponService.getByAttributes(
            {
              couponCode,
              isDeleted: false,
              isActive: true,
              expirationDate: { $gte: new Date(nowUtcIso) },
            },
            loginUser,
          );

          // Validate coupon category is 'subscription'
          const couponCategory = await this.globalCodeModel.findOne({
            _id: couponDetails.couponCategory,
            isDeleted: false,
            isActive: true
          });

          if (!couponCategory || couponCategory.value !== 'subscription') {
            throw new RpcException({
              statusCode: StatusCodeEnum.BAD_REQUEST,
              message: ErrorMessages.en.INVALID_COUPON,
            });
          }

          // Check one-time usage (only if loginUser is a real user, not anonymous)
          if (couponDetails.usageTypeName === CouponUsageType.ONE_TIME) {
            if (loginUser && loginUser.userId && loginUser.userId !== 'anonymous') {
              const couponUsed = await this.subscriptionModel.findOne({
                couponId: couponDetails._id,
                userId: new Types.ObjectId(loginUser.userId || loginUser._id),
                status: { $in: ['active', 'past_due'] },
              });

              if (couponUsed) {
                throw new RpcException({
                  statusCode: StatusCodeEnum.BAD_REQUEST,
                  message: ErrorMessages.en.COUPON_ALREADY_USED,
                });
              }
            }
          }

          // Calculate discount
          const { discountTypeName, discountValue } = couponDetails;
          if (discountTypeName === CouponType.PERCENTAGE) {
            discountAmount = parseFloat(((baseAmount * discountValue) / 100).toFixed(2));
          } else if (discountTypeName === CouponType.PRICE) {
            discountAmount = discountValue;
          }
          
          couponId = couponDetails._id.toString();
          couponDiscountTypeName = discountTypeName;
          couponDiscountValue = discountValue;

        } catch (couponError: any) {
          throw couponError;
        }
      }

      const payableAmount = Math.max(0, parseFloat((baseAmount - discountAmount).toFixed(2)));

      return {
        baseAmount,
        discountAmount,
        payableAmount,
        ...(couponId && { couponId }),
        ...(couponCode && { couponCode }),
        ...(couponDiscountTypeName && { couponDiscountTypeName }),
        ...(couponDiscountValue && { couponDiscountValue }),
      };

    } catch (error: any) {
      if (error instanceof RpcException || error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error('Failed to get subscription totals', {
        error: error?.message,
        planId: dto?.planId,
        couponCode: dto?.couponCode
      });
      
      throw new InternalServerErrorException(
        error?.message || 'Failed to get subscription totals',
      );
    }
  }


async getPlans(body: {
  interval?: 'monthly' | 'yearly';
  userType?: string;
}) {
  // Base: only active plans (or old records without the isActive field)
  const activeCondition = {
    $or: [
      { isActive: true },
      { isActive: { $exists: false } },
    ],
  };

  const filterConditions: any[] = [activeCondition];

  if (body?.interval) {
    filterConditions.push({ interval: body.interval });
  }

  if (body?.userType) {
    const trimmedType = body.userType.trim().toLowerCase();
    // Plans without a userType field are legacy/untagged and default to "individual".
    // - individual → tagged individual plans + untagged plans
    // - couple / team → only explicitly tagged plans (no cross-contamination)
    const userTypeCondition =
      trimmedType === UserType.INDIVIDUAL
        ? {
            $or: [
              { userType: { $regex: new RegExp(`^\\s*${trimmedType}\\s*$`, 'i') } },
              { userType: { $exists: false } },
              { userType: null },
              { userType: '' },
            ],
          }
        : { userType: { $regex: new RegExp(`^\\s*${trimmedType}\\s*$`, 'i') } };

    filterConditions.push(userTypeCondition);
  }

  const filter = filterConditions.length === 1
    ? filterConditions[0]
    : { $and: filterConditions };

  const plans = await this.planModel
    .find(filter)
    .select(
  'name description interval price currency includedCourses includedBundles includedAssessments includedAppointments includedAppointmentPackages courseStatement bundleStatement assessmentStatement appointmentPackageStatement isPopular isAiCoachIncluded aiCoachStatement aiCoachCopilotStatement userType',
    )
    .populate('includedAppointmentPackages')
    .sort({ price: 1 })
    .lean();

  return plans;
}


  // USER – GET APPOINTMENT ALLOWANCES (includes partner's couple subscription)
  async getAppointmentAllowances(userId: string) {
    // First check the user's own subscription
    let sub = await this.subscriptionModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: { $in: ['active', 'past_due'] },
        endDate: { $gte: new Date() },
      })
      .sort({ createdAt: -1 })
      .lean();

    // If no own subscription, check if partner has a couple subscription that covers this user
    if (!sub) {
      const user = await this.userModel.findById(userId).select('partnerId').lean();
      if (user?.partnerId) {
        const partnerSub = await this.subscriptionModel
          .findOne({
            userId: new Types.ObjectId(user.partnerId.toString()),
            status: { $in: ['active', 'past_due'] },
            endDate: { $gte: new Date() },
          })
          .sort({ createdAt: -1 })
          .populate('planId')
          .lean();

        if (partnerSub) {
          const partnerPlan = partnerSub.planId as any;
          const planUserType = (partnerPlan?.userType || '').toString().trim().toLowerCase();
          if (planUserType === UserType.COUPLE) {
            sub = partnerSub;
          }
        }
      }
    }

    if (!sub) {
      return {
        hasActiveSubscription: false,
        allowances: [],
      };
    }

    return {
      hasActiveSubscription: true,
      endDate: sub.endDate,
      planId: sub.planId,
      allowances: sub.appointmentAllowances ?? [],
    };
  }

  // USER – CHECK IF CAN BOOK GIVEN APPOINTMENT TYPE (includes partner's couple subscription)
  async canBookAppointment(userId: string, payload: { appointmentTypeId: string }) {
    const { appointmentTypeId } = payload || {} as any;
    if (!appointmentTypeId || !Types.ObjectId.isValid(appointmentTypeId)) {
      throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_APPOINTMENT_TYPE_ID);
    }

    // Check user's own subscription first
    let sub = await this.subscriptionModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: { $in: ['active', 'past_due'] },
        endDate: { $gte: new Date() },
      })
      .sort({ createdAt: -1 })
      .lean();

    // If no own subscription, check partner's couple subscription
    if (!sub) {
      const user = await this.userModel.findById(userId).select('partnerId').lean();
      if (user?.partnerId) {
        const partnerSub = await this.subscriptionModel
          .findOne({
            userId: new Types.ObjectId(user.partnerId.toString()),
            status: { $in: ['active', 'past_due'] },
            endDate: { $gte: new Date() },
          })
          .sort({ createdAt: -1 })
          .populate('planId')
          .lean();

        if (partnerSub) {
          const partnerPlan = partnerSub.planId as any;
          const planUserType = (partnerPlan?.userType || '').toString().trim().toLowerCase();
          if (planUserType === UserType.COUPLE) {
            sub = partnerSub;
          }
        }
      }
    }

    if (!sub) {
      return { allowed: false, reason: 'no_active_subscription' };
    }

    const allowances = sub.appointmentAllowances || [];
    const match = allowances.find(
      a => a.appointmentTypeId?.toString() === appointmentTypeId,
    );
    if (!match) {
      return { allowed: false, reason: 'not_included_in_plan' };
    }
    if ((match.remaining ?? 0) <= 0) {
      return { allowed: false, reason: 'limit_exhausted' };
    }
    return { allowed: true, remaining: match.remaining, endDate: sub.endDate };
  }

  // ADMIN – LIST SUBSCRIBERS WITH PLAN DETAILS
  async adminListSubscribers(query?: { status?: 'active' | 'past_due' | 'expired' | 'canceled' }) {
    const match: any = {};
    if (query?.status) {
      match.status = query.status;
    }

    const pipeline: any[] = [
      { $match: match },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          paymentStatus: 1,
          amountPaid: 1,
          currency: 1,
          user: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email',
          },
          plan: {
            _id: '$plan._id',
            name: '$plan.name',
            description: '$plan.description',
            interval: '$plan.interval',
            price: '$plan.price',
            courseStatement: '$plan.courseStatement',
            bundleStatement: '$plan.bundleStatement',
            assessmentStatement: '$plan.assessmentStatement',
          },
        },
      },
      { $sort: { startDate: -1 } },
    ];

    const data = await this.subscriptionModel.aggregate(pipeline);
    return {
      total: data.length,
      subscribers: data,
    };
  }

  // ADMIN – UPDATE PLAN (DB + STRIPE)
  async updatePlan(dto: any) {
    const { planId } = dto || {};

    this.logger.log('[updatePlan] Starting plan update', {
      planId,
      dtoIncludedAppointmentPackages: dto.includedAppointmentPackages,
    });

    if (!planId || !Types.ObjectId.isValid(planId)) {
      throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_PLANID);
    }

    const plan = await this.planModel.findById(planId);
    if (!plan) {
      throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.PLAN_NOT_FOUND);
    }

    // Store old included items before updating (for granting new items to existing subscribers)
    const oldIncludedCourses = new Set(((plan as any).includedCourses || []).map((id: any) => id.toString()));
    const oldIncludedBundles = new Set(((plan as any).includedBundles || []).map((id: any) => id.toString()));
    const oldIncludedAssessments = new Set(((plan as any).includedAssessments || []).map((id: any) => id.toString()));
    const oldIncludedAppointmentPackages = new Set(((plan as any).includedAppointmentPackages || []).map((id: any) => id.toString()));

    this.logger.log('[updatePlan] Old plan items', {
      oldAppointmentPackages: Array.from(oldIncludedAppointmentPackages),
    });

    const stripe = this.stripeService.getClient();

    // Update product name/description if provided
    const productUpdates: any = {};
    if (dto.name) productUpdates.name = dto.name;
    if (dto.description !== undefined) productUpdates.description = dto.description;
    if (Object.keys(productUpdates).length && plan.stripeProductId) {
      try {
        await stripe.products.update(plan.stripeProductId, productUpdates);
      } catch (stripeError: any) {
        this.logger.warn(`Failed to update Stripe product ${plan.stripeProductId}: ${stripeError.message}`);
      }
    }

    // Handle price update if price/currency/interval changed
    let newPriceId: string | undefined;
    const priceChanged =
      (dto.price !== undefined && dto.price !== plan.price) ||
      (dto.currency && dto.currency !== plan.currency) ||
      (dto.interval && dto.interval !== plan.interval);

    if (priceChanged && plan.stripeProductId) {
      const stripeInterval = (dto.interval ?? plan.interval) === 'monthly' ? 'month' : 'year';
      const currency = dto.currency ?? plan.currency ?? 'usd';
      const unitAmount = Math.round(((dto.price ?? plan.price) as number) * 100);

      try {
        // Create new recurring price tied to same product
        const price = await stripe.prices.create({
          unit_amount: unitAmount,
          currency,
          recurring: { interval: stripeInterval },
          product: plan.stripeProductId,
        });
        newPriceId = price.id;

        // Deactivate old price
        if (plan.stripePriceId) {
          try { await stripe.prices.update(plan.stripePriceId, { active: false }); } catch {}
        }
      } catch (stripeError: any) {
        this.logger.warn(`Failed to create new Stripe price for product ${plan.stripeProductId}: ${stripeError.message}`);
      }
    }

    // Build update object to use findByIdAndUpdate (avoids Mongoose VersionError on array fields)
    const updateFields: Record<string, any> = {};
    if (dto.name !== undefined) updateFields.name = dto.name;
    if (dto.description !== undefined) updateFields.description = dto.description;
    if (dto.interval !== undefined) updateFields.interval = dto.interval;
    if (dto.price !== undefined) updateFields.price = dto.price;
    if (dto.currency !== undefined) updateFields.currency = dto.currency;
    if (dto.includedCourses !== undefined) updateFields.includedCourses = dto.includedCourses;
    if (dto.includedBundles !== undefined) updateFields.includedBundles = dto.includedBundles;
    if (dto.includedAssessments !== undefined) updateFields.includedAssessments = dto.includedAssessments;
    if (dto.includedAppointments !== undefined) updateFields.includedAppointments = dto.includedAppointments;
    if (dto.courseStatement !== undefined) updateFields.courseStatement = dto.courseStatement;
    if (dto.bundleStatement !== undefined) updateFields.bundleStatement = dto.bundleStatement;
    if (dto.assessmentStatement !== undefined) updateFields.assessmentStatement = dto.assessmentStatement;
    if (dto.includedAppointmentPackages !== undefined) updateFields.includedAppointmentPackages = dto.includedAppointmentPackages;
    if (dto.appointmentPackageStatement !== undefined) updateFields.appointmentPackageStatement = dto.appointmentPackageStatement;
    if (dto.isPopular !== undefined) updateFields.isPopular = dto.isPopular;
    if (dto.isActive !== undefined) updateFields.isActive = dto.isActive;
    if (dto.isAiCoachIncluded !== undefined) updateFields.isAiCoachIncluded = dto.isAiCoachIncluded;
    if (dto.aiCoachStatement !== undefined) updateFields.aiCoachStatement = dto.aiCoachStatement;

    // Update aiCoachCopilotStatement based on copilotType
    if (dto.isAiCoachIncluded && dto.copilotType) {
      updateFields.aiCoachCopilotStatement = dto.copilotType === 'pro'
        ? 'Mojo™ Pro AI Coach Copilot'
        : 'Mojo™ AI Coach Copilot';
    }

    if (newPriceId) updateFields.stripePriceId = newPriceId;

    const updatedPlan = await this.planModel.findByIdAndUpdate(
      planId,
      { $set: updateFields },
      { new: true },
    );

    if (!updatedPlan) {
      throw new RpcException({ statusCode: 404, message: 'Plan not found after update' });
    }

    // Find newly added items (present in new but not in old)
    const newCourses = (dto.includedCourses || []).filter((id: any) => !oldIncludedCourses.has(id.toString()));
    const newBundles = (dto.includedBundles || []).filter((id: any) => !oldIncludedBundles.has(id.toString()));
    const newAssessments = (dto.includedAssessments || []).filter((id: any) => !oldIncludedAssessments.has(id.toString()));
    const newAppointmentPackages = (dto.includedAppointmentPackages || []).filter((id: any) => !oldIncludedAppointmentPackages.has(id.toString()));

    this.logger.log('[updatePlan] Calculated new items to grant', {
      dtoAppointmentPackages: dto.includedAppointmentPackages,
      oldAppointmentPackages: Array.from(oldIncludedAppointmentPackages),
      newAppointmentPackages: newAppointmentPackages,
    });

    const hasNewItems = newCourses.length > 0 || newBundles.length > 0 || newAssessments.length > 0 || newAppointmentPackages.length > 0;

    this.logger.log('[updatePlan] hasNewItems check', { hasNewItems, newAppointmentPackagesCount: newAppointmentPackages.length });

    // Grant new items to all users with active subscriptions for this plan
    if (hasNewItems) {
      this.logger.log('Plan updated with new items, granting to existing subscribers', {
        planId,
        newCourses: newCourses.length,
        newBundles: newBundles.length,
        newAssessments: newAssessments.length,
        newAppointmentPackages: newAppointmentPackages.length,
      });

      // Find all active subscriptions for this plan
      const activeSubscriptions = await this.subscriptionModel.find({
        planId: new Types.ObjectId(planId),
        status: { $in: ['active', 'past_due'] },
      });

      this.logger.log(`Found ${activeSubscriptions.length} active subscriptions to update`);

      // Grant new items to each subscriber
      for (const subscription of activeSubscriptions) {
        try {
          const newItemsPlan = {
            includedCourses: newCourses.map((id: any) => new Types.ObjectId(id)),
            includedBundles: newBundles.map((id: any) => new Types.ObjectId(id)),
            includedAssessments: newAssessments.map((id: any) => new Types.ObjectId(id)),
            includedAppointmentPackages: newAppointmentPackages.map((id: any) => new Types.ObjectId(id)),
          };

          this.logger.log(`[updatePlan] Calling grantSubscriptionContent for user ${subscription.userId}`, {
            subscriptionId: subscription._id,
            appointmentPackagesToGrant: newItemsPlan.includedAppointmentPackages.map(id => id.toString()),
          });

          await this.grantSubscriptionContent(
            subscription.userId,
            newItemsPlan,
            subscription._id as Types.ObjectId,
          );

          this.logger.log(`[updatePlan] Successfully granted new plan items to user ${subscription.userId}`);

          // COUPLE PLAN: Also grant new items to partner
          const planUserType = (updatedPlan.userType || '').toString().trim().toLowerCase();
          if (planUserType === UserType.COUPLE) {
            try {
              const subUser = await this.userModel.findById(subscription.userId).select('partnerId').lean();
              if (subUser?.partnerId) {
                const partnerId = new Types.ObjectId(subUser.partnerId.toString());
                await this.grantSubscriptionContent(
                  partnerId,
                  newItemsPlan,
                  subscription._id as Types.ObjectId,
                );
                this.logger.log(`[updatePlan] Successfully granted new plan items to partner ${partnerId}`);
              }
            } catch (coupleError) {
              this.logger.error(`[updatePlan] Failed to grant new items to partner of user ${subscription.userId}`, coupleError);
            }
          }
        } catch (error) {
          this.logger.error(`[updatePlan] Failed to grant new items to user ${subscription.userId}`, error);
        }
      }
    } else {
      this.logger.log('[updatePlan] No new items to grant to subscribers');
    }

    return updatedPlan.toObject();
  }

  // ADMIN – DELETE PLAN (DB + STRIPE ARCHIVE/DEACTIVATE)
  async deletePlan(dto: { planId: string }) {
    try {
      const { planId } = dto || {} as any;
      if (!planId || !Types.ObjectId.isValid(planId)) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_PLANID);
      }

      const plan = await this.planModel.findById(planId);
      if (!plan) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.PLAN_NOT_FOUND);
      }

      // Prevent deletion if active subscriptions exist
      const activeCount = await this.subscriptionModel.countDocuments({
        planId: new Types.ObjectId(planId),
        status: { $in: ['active', 'past_due', 'pending'] },
      });
      if (activeCount > 0) {
        throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.ACTIVE_SUBSCRIPTIONS_EXIST);
      }

      const stripe = this.stripeService.getClient();
      // Deactivate price
      if (plan.stripePriceId) {
        try { await stripe.prices.update(plan.stripePriceId, { active: false }); } catch {}
      }
      // Archive product
      if (plan.stripeProductId) {
        try { await stripe.products.update(plan.stripeProductId, { active: false }); } catch {}
      }

      // Remove from DB
      await this.planModel.deleteOne({ _id: plan._id });
      return { deleted: true };
    } catch (error) {
      // Re-throw RpcExceptions as-is
      if (error instanceof RpcException) {
        throw error;
      }
      
      console.error('Delete plan error:', error);
      throw new RpcException({
        statusCode: 500,
        message: error.message || 'Internal server error'
      });
    }
  }

  // ADMIN – GET PLAN BY ID (FULL DETAILS)
  async adminGetPlanById(dto: { planId: string }) {
    const { planId } = dto || ({} as any);
    if (!planId || !Types.ObjectId.isValid(planId)) {
      throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_PLANID);
    }

    const plan = await this.planModel
      .findById(planId)
      .select(
        'name description interval price currency includedCourses includedBundles includedAssessments includedAppointments courseStatement bundleStatement assessmentStatement isActive isPopular isAiCoachIncluded aiCoachStatement userType createdAt updatedAt',
      )
      .populate('userType')
      .lean();

    if (!plan) {
      throw new BadRequestException(ErrorMessages[Common.DEFAULT_LANG]?.PLAN_NOT_FOUND);
    }

    return plan;
  }

  // USER – LIST OWN SUBSCRIPTIONS WITH PLAN DETAILS
  async listMySubscriptions(
    userId: string,
    query?: { status?: 'active' | 'past_due' | 'pending' | 'canceled' | 'expired'; page?: number; limit?: number },
  ) {
    // Include user's own subscriptions AND partner's couple subscriptions shared with them
    const userIds: Types.ObjectId[] = [new Types.ObjectId(userId)];

    // Check if user has a partner with a couple subscription
    const user = await this.userModel.findById(userId).select('partnerId').lean();
    if (user?.partnerId) {
      userIds.push(new Types.ObjectId(user.partnerId.toString()));
    }

    const match: any = { userId: { $in: userIds } };
    if (query?.status) {
      match.status = query.status;
    }

    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query?.limit) || 20));
    const skip = (page - 1) * limit;

    const userObjectId = new Types.ObjectId(userId);

    const pipeline: any[] = [
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $lookup: { from: 'subscriptionplans', localField: 'planId', foreignField: '_id', as: 'plan' } },
      { $unwind: { path: '$plan', preserveNullAndEmptyArrays: true } },
      // Filter out partner's subscriptions that are NOT couple plans
      {
        $match: {
          $or: [
            { userId: userObjectId }, // Always show user's own subscriptions
            { 'plan.userType': { $regex: /^couple$/i } }, // Only show partner's couple subscriptions
          ],
        },
      },
      {
        $addFields: {
          isSharedByPartner: { $ne: ['$userId', userObjectId] },
        },
      },
      {
        $project: {
          _id: 1,
          planId: 1,
          userId: 1,
          status: 1,
          paymentStatus: 1,
          amountPaid: 1,
          currency: 1,
          startDate: 1,
          endDate: 1,
          appointmentAllowances: 1,
          createdAt: 1,
          updatedAt: 1,
          isSharedByPartner: 1,
          plan: {
            _id: '$plan._id',
            name: '$plan.name',
            description: '$plan.description',
            interval: '$plan.interval',
            price: '$plan.price',
            currency: '$plan.currency',
            includedCourses: '$plan.includedCourses',
            includedBundles: '$plan.includedBundles',
            includedAssessments: '$plan.includedAssessments',
            includedAppointments: '$plan.includedAppointments',
            courseStatement: '$plan.courseStatement',
            bundleStatement: '$plan.bundleStatement',
            assessmentStatement: '$plan.assessmentStatement',
            isAiCoachIncluded: '$plan.isAiCoachIncluded',
            userType: '$plan.userType',
          },
        },
      },
    ];

    const [items, totalArr] = await Promise.all([
      this.subscriptionModel.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
      this.subscriptionModel.aggregate([...pipeline, { $count: 'total' }]),
    ]);

    const total = totalArr?.[0]?.total ?? 0;
    return { result: items, total, page, limit };
  }

  // ==========================================
  // AFFILIATE TRANSACTION METHODS
  // ==========================================

  /**
   * Get list of affiliate transactions with pagination and filtering
   */
  async getAffiliateTransactions(dto: {
    page?: number;
    limit?: number;
    coachId?: string;
    clientId?: string;
    subscriptionId?: string;
    transactionType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      limit = 10,
      coachId,
      clientId,
      subscriptionId,
      transactionType,
      status,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = dto;

    const skip = (page - 1) * limit;

    // Build filter query
    const filter: any = {
      isDeleted: false,
    };

    if (coachId) {
      filter.coachId = new Types.ObjectId(coachId);
    }

    if (clientId) {
      filter.clientId = new Types.ObjectId(clientId);
    }

    if (subscriptionId) {
      filter.subscriptionId = new Types.ObjectId(subscriptionId);
    }

    if (transactionType) {
      filter.transactionType = transactionType;
    }

    if (status) {
      filter.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) {
        filter.paymentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.paymentDate.$lte = new Date(endDate);
      }
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Aggregation pipeline with lookups
    const pipeline: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, email: 1, profileImageUrl: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'coachId',
          foreignField: '_id',
          as: 'coach',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, email: 1, profileImageUrl: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscriptionId',
          foreignField: '_id',
          as: 'subscription',
        },
      },
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'subscriptionPlanId',
          foreignField: '_id',
          as: 'subscriptionPlan',
          pipeline: [
            { $project: { name: 1, price: 1, interval: 1, currency: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'coupons',
          localField: 'couponId',
          foreignField: '_id',
          as: 'coupon',
          pipeline: [
            { $project: { couponCode: 1, name: 1, discountTypeName: 1, discountValue: 1 } },
          ],
        },
      },
      {
        $addFields: {
          client: { $arrayElemAt: ['$client', 0] },
          coach: { $arrayElemAt: ['$coach', 0] },
          subscription: { $arrayElemAt: ['$subscription', 0] },
          subscriptionPlan: { $arrayElemAt: ['$subscriptionPlan', 0] },
          couponDetails: { $arrayElemAt: ['$coupon', 0] },
          // Add invoice link for easy access
          invoicePdfLink: '$stripeInvoiceData.invoice_pdf',
          // Share details summary for convenience
          shareDetails: {
            platform: {
              paymentAmount: '$platformView.paymentAmount',
              stripeProcessingFee: '$platformView.stripeProcessingFee',
              netAmount: '$platformView.netAmount',
              collectedFee: '$platformView.collectedFee',
              currency: '$platformView.currency',
            },
            connectedAccount: {
              coachConnectAccountId: '$coachConnectAccountId',
              grossAmount: '$coachView.grossAmountOriginal',
              totalFees: '$coachView.totalFees',
              netAmount: '$coachView.netAmount',
              currency: '$coachView.netCurrency',
            },
            split: {
              coachPercentage: '$splitCalculation.coachPercentage',
              platformPercentage: '$splitCalculation.platformPercentage',
              coachShare: '$splitCalculation.coachShareOfNet',
              platformShare: '$splitCalculation.platformShareOfNet',
              stripeFee: '$splitCalculation.stripeProcessingFee',
            },
          },
        },
      },
      { $sort: sort },
    ];

    const [items, totalArr] = await Promise.all([
      this.affiliateTransactionModel.aggregate([
        ...pipeline,
        { $skip: skip },
        { $limit: limit },
      ]),
      this.affiliateTransactionModel.aggregate([
        ...pipeline,
        { $count: 'total' },
      ]),
    ]);

    const total = totalArr?.[0]?.total ?? 0;

    // Fetch invoice URLs from Stripe for items that don't have them stored
    const stripe = this.stripeService.getClient();
    const enrichedItems = await Promise.all(
      items.map(async (item: any) => {
        // If invoice link is already available, return as-is
        if (item.invoiceLink || item.stripeInvoiceData?.hosted_invoice_url) {
          return item;
        }

        // If we have stripeInvoiceId, fetch invoice details from Stripe
        if (item.stripeInvoiceId) {
          try {
            const invoice = await stripe.invoices.retrieve(item.stripeInvoiceId);
            // item.invoiceLink = invoice.hosted_invoice_url || null;
            item.invoicePdfLink = invoice.invoice_pdf || null;

          } catch (error) {
            console.error(`Failed to fetch invoice ${item.stripeInvoiceId}:`, error.message);
            item.invoiceLink = null;
            item.invoicePdfLink = null;
          }
        }

        return item;
      }),
    );

    return {
      result: enrichedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get affiliate transaction by ID
   */
  async getAffiliateTransactionById(transactionId: string) {
    if (!Types.ObjectId.isValid(transactionId)) {
      throw new BadRequestException('Invalid transaction ID');
    }

    const pipeline: any[] = [
      {
        $match: {
          _id: new Types.ObjectId(transactionId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, email: 1, profileImageUrl: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'coachId',
          foreignField: '_id',
          as: 'coach',
          pipeline: [
            { $project: { firstName: 1, lastName: 1, email: 1, profileImageUrl: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscriptionId',
          foreignField: '_id',
          as: 'subscription',
        },
      },
      {
        $lookup: {
          from: 'subscriptionplans',
          localField: 'subscriptionPlanId',
          foreignField: '_id',
          as: 'subscriptionPlan',
          pipeline: [
            { $project: { name: 1, price: 1, interval: 1, currency: 1, description: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'affiliates',
          localField: 'affiliateId',
          foreignField: '_id',
          as: 'affiliate',
          pipeline: [
            { $project: { coachPercentage: 1, affiliateLink: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'coupons',
          localField: 'couponId',
          foreignField: '_id',
          as: 'coupon',
          pipeline: [
            { $project: { couponCode: 1, name: 1, discountTypeName: 1, discountValue: 1 } },
          ],
        },
      },
      {
        $addFields: {
          client: { $arrayElemAt: ['$client', 0] },
          coach: { $arrayElemAt: ['$coach', 0] },
          subscription: { $arrayElemAt: ['$subscription', 0] },
          subscriptionPlan: { $arrayElemAt: ['$subscriptionPlan', 0] },
          affiliate: { $arrayElemAt: ['$affiliate', 0] },
          couponDetails: { $arrayElemAt: ['$coupon', 0] },
        },
      },
    ];

    const result = await this.affiliateTransactionModel.aggregate(pipeline);

    if (!result || result.length === 0) {
      throw new NotFoundException('Transaction not found');
    }

    return result[0];
  }

  /**
   * Get affiliate transactions for a specific coach (coach's earnings)
   */
  async getCoachAffiliateTransactions(coachId: string, dto: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    return this.getAffiliateTransactions({
      ...dto,
      coachId,
    });
  }

  /**
   * Get affiliate transaction summary/stats for a coach
   */
  async getCoachAffiliateSummary(coachId: string, dto: {
    startDate?: string;
    endDate?: string;
  }) {
    const { startDate, endDate } = dto;

    // Build filter
    const filter: any = {
      coachId: new Types.ObjectId(coachId),
      status: AffiliateTransactionStatus.COMPLETED,
      isDeleted: false,
    };

    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) {
        filter.paymentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.paymentDate.$lte = new Date(endDate);
      }
    }

    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalGrossAmount: { $sum: '$platformView.paymentAmount' },
          totalCoachEarnings: { $sum: '$coachView.netAmount' },
          totalPlatformFees: { $sum: '$platformView.collectedFee' },
          totalStripeProcessingFees: { $sum: '$platformView.stripeProcessingFee' },
          avgCoachPercentage: { $avg: '$splitCalculation.coachPercentage' },
          currencies: { $addToSet: '$platformView.currency' },
        },
      },
      {
        $project: {
          _id: 0,
          totalTransactions: 1,
          totalGrossAmount: { $round: ['$totalGrossAmount', 2] },
          totalCoachEarnings: { $round: ['$totalCoachEarnings', 2] },
          totalPlatformFees: { $round: ['$totalPlatformFees', 2] },
          totalStripeProcessingFees: { $round: ['$totalStripeProcessingFees', 2] },
          avgCoachPercentage: { $round: ['$avgCoachPercentage', 2] },
          currencies: 1,
        },
      },
    ];

    const result = await this.affiliateTransactionModel.aggregate(pipeline);

    // Also get breakdown by transaction type
    const typeBreakdown = await this.affiliateTransactionModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$transactionType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$platformView.paymentAmount' },
          totalCoachEarnings: { $sum: '$coachView.netAmount' },
        },
      },
      {
        $project: {
          transactionType: '$_id',
          count: 1,
          totalAmount: { $round: ['$totalAmount', 2] },
          totalCoachEarnings: { $round: ['$totalCoachEarnings', 2] },
          _id: 0,
        },
      },
    ]);

    return {
      summary: result[0] || {
        totalTransactions: 0,
        totalGrossAmount: 0,
        totalCoachEarnings: 0,
        totalPlatformFees: 0,
        totalStripeProcessingFees: 0,
        avgCoachPercentage: 0,
        currencies: [],
      },
      byTransactionType: typeBreakdown,
    };
  }
}
