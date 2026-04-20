import { Controller, UseGuards, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';
import { SubscriptionService } from './subscription.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { UpgradeSubscriptionDto, UpgradePreviewDto } from './dto/upgrade-subscription.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
 
import { JwtAuthGuard, IContext, HasRoles, Roles, RoleGuard, sendResponse, ResponseMessages, ErrorMessages, Common } from '@app/common';
// ...existing imports...
 
@Controller()
// @UseGuards(JwtAuthGuard, RoleGuard)
export class SubscriptionController {
  private readonly logger = new Logger(SubscriptionController.name);
 
  constructor(private readonly subscriptionService: SubscriptionService) {}
 
  // ADMIN
@UseGuards(JwtAuthGuard, RoleGuard)
 
@HasRoles(Roles.ADMIN, Roles.SUPERADMIN)
@MessagePattern('subscription-create-plan')
async createPlan(@Payload() payload: any, @Ctx() context: IContext) {
  const langCode = context?.user?.langCode;
 
  // ✅ CORRECT UNWRAP FOR YOUR GATEWAY
  const dto =
    payload?.body ??
    payload?.data?.body ??
    payload?.data ??
    payload;
 
  // 🔐 Hard validation
  if (!dto?.name) {
    throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_SUBSCRIPTION_PLAN_PAYLOAD);
  }
  if (
  dto.isAiCoachIncluded !== undefined &&
  typeof dto.isAiCoachIncluded !== 'boolean'
) {
  throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.ISAICOACHINCLUDED_MUST_BE_BOOLEAN);
}
  if (
    dto.aiCoachStatement !== undefined &&
    typeof dto.aiCoachStatement !== 'string'
  ) {
    throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.AICOACHSTATEMENT_MUST_BE_STRING);
  }
 
  const result = await this.subscriptionService.createPlan(dto, context.user._id); // ✅ Pass creator ID
 
  return sendResponse(
    true,
    ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_CREATED_SUCCESS ||
      'Plan created successfully',
    result,
  );
}
 
  // USER – MY SUBSCRIPTIONS
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.CLIENT, Roles.ADMIN, Roles.COACH, Roles.SUPERADMIN, Roles.SUBADMIN)
  @MessagePattern('subscription-my-list')
  async mySubscriptions(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    const result = await this.subscriptionService.listMySubscriptions(
      context.user._id,
      dto,
    );
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_LIST_FETCHED || 'Subscriptions fetched successfully',
      result,
    );
  }
 
 
//   // USER
@UseGuards(JwtAuthGuard, RoleGuard)
@HasRoles(Roles.CLIENT, Roles.ADMIN, Roles.COACH, Roles.SUPERADMIN)
@MessagePattern('subscription-subscribe')
async subscribe(
  @Payload() payload: any,
  @Ctx() context: IContext,
) {
  const startTime = Date.now();
  const userId = context.user._id;
  const userEmail = context.user.email;
  const userRoles = context.user.roles;
 
  this.logger.log(`[CONTROLLER] Subscription request received`, {
    userId,
    userEmail,
    userRoles,
    timestamp: new Date().toISOString()
  });
 
  try {
    // Log the raw payload structure for debugging
    this.logger.debug(`[CONTROLLER] Raw payload structure`, {
      userId,
      hasBody: !!payload?.body,
      hasDataBody: !!payload?.data?.body,
      hasData: !!payload?.data,
      payloadKeys: Object.keys(payload || {})
    });
 
    const dto =
      payload?.body ??
      payload?.data?.body ??
      payload?.data ??
      payload;
 
    // Log the processed DTO
    this.logger.log(`[CONTROLLER] Processing subscription request`, {
      userId,
      planId: dto?.planId,
      hasPaymentMethod: !!dto?.paymentMethodId,
      hasCouponCode: !!dto?.couponCode,
      paymentMethodType: dto?.paymentMethodId ? 'provided' : 'none',
      couponCode: dto?.couponCode || 'none',
      clientId:dto?.clientId
    });
    
    // Call the service with detailed logging
    this.logger.log(`[CONTROLLER] Calling subscription service`, { userId });
    
    const result = await this.subscriptionService.subscribe(
      userId,
      dto,
      context.user 
    );
 
    const processingTime = Date.now() - startTime;
 
    // Log successful completion
    this.logger.log(`[CONTROLLER] Subscription completed successfully`, {
      userId,
      subscriptionId: result?.subscriptionId,
      status: result?.status,
      finalAmount: result?.finalAmount,
      discountAmount: result?.discountAmount,
      processingTimeMs: processingTime,
      hasCoupon: !!result?.stripeCouponId,
      hasClientSecret: !!result?.clientSecret
    });
 
    const response = sendResponse(
      true,
      'Subscription activated successfully',
      result,
    );
 
    this.logger.log(`[CONTROLLER] Response sent to client`, {
      userId,
      status: response.status,
      message: response.message,
      totalProcessingTimeMs: Date.now() - startTime
    });
 
    return response;
 
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    this.logger.error(`[CONTROLLER] Subscription request failed`, {
      userId,
      userEmail,
      errorName: error.constructor.name,
      errorMessage: error.message,
      statusCode: error.statusCode || error.status,
      processingTimeMs: processingTime,
      stack: error.stack
    });
 
    // Re-throw the error to let the global error handler manage it
    throw error;
  }
}
 
 
  @UseGuards(JwtAuthGuard)
  @MessagePattern('subscription-cancel')
  async cancel(@Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const result = await this.subscriptionService.cancel(context?.user?._id);
    return sendResponse(true, ResponseMessages[langCode]?.SUBSCRIPTION_CANCELLED_SUCCESS || 'Subscription cancelled successfully', result);
  }
 
 
  // NEW: Get subscription totals with coupon validation
  @MessagePattern('subscription-get-totals')
  async getSubscriptionTotals(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    const result = await this.subscriptionService.getSubscriptionTotals(dto, context.user);
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUCCESS || 'Request processed successfully',
      result,
    );
  }
 
 
@MessagePattern('subscription-get-plans')
async getPlans(
  @Payload() payload: any,
  @Ctx() context: IContext,
) {
  const langCode = context?.user?.langCode;
  const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
  const plans = await this.subscriptionService.getPlans(dto);
 
  return sendResponse(
    true,
    ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_LIST_FETCHED ||
      'Subscription plans fetched successfully',
    plans,
  );
}
 
 
 
 
  
 
  // USER – GET APPOINTMENT ALLOWANCES
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.CLIENT, Roles.ADMIN, Roles.COACH, Roles.SUPERADMIN, Roles.SUBADMIN)
  @MessagePattern('subscription-get-appointment-allowances')
  async getAppointmentAllowances(@Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const result = await this.subscriptionService.getAppointmentAllowances(
      context.user._id,
    );
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_LIST_FETCHED || 'Allowances fetched successfully',
      result,
    );
  }
 
  // USER – CAN BOOK GIVEN APPOINTMENT TYPE
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.CLIENT, Roles.ADMIN, Roles.COACH, Roles.SUPERADMIN, Roles.SUBADMIN)
  @MessagePattern('subscription-can-book-appointment')
  async canBookAppointment(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    const result = await this.subscriptionService.canBookAppointment(
      context.user._id,
      dto,
    );
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_LIST_FETCHED || 'Check complete',
      result,
    );
  }
 
  // ADMIN – SUBSCRIBERS LIST
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.SUBADMIN)
  @MessagePattern('subscription-admin-list-subscribers')
  async adminListSubscribers(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    const result = await this.subscriptionService.adminListSubscribers(dto);
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_LIST_FETCHED || 'Subscribers fetched successfully',
      result,
    );
  }
 
  // ADMIN – UPDATE PLAN
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @MessagePattern('subscription-admin-update-plan')
  async adminUpdatePlan(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    
    //  Validation for AI Coach fields
    if (
      dto.isAiCoachIncluded !== undefined &&
      typeof dto.isAiCoachIncluded !== 'boolean'
    ) {
      throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.ISAICOACHINCLUDED_MUST_BE_BOOLEAN);
    }
    if (
      dto.aiCoachStatement !== undefined &&
      typeof dto.aiCoachStatement !== 'string'
    ) {
      throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.AICOACHSTATEMENT_MUST_BE_STRING);
    }
    
    const result = await this.subscriptionService.updatePlan(dto);
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_CREATED_SUCCESS || 'Plan updated successfully',
      result,
    );
  }
 
  // ADMIN – DELETE PLAN
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @MessagePattern('subscription-admin-delete-plan')
  async adminDeletePlan(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    const result = await this.subscriptionService.deletePlan(dto);
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_CREATED_SUCCESS || 'Plan deleted successfully',
      result,
    );
  }
 
  // ADMIN – GET PLAN BY ID
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.SUBADMIN)
  @MessagePattern('subscription-admin-get-plan')
  async adminGetPlan(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    const result = await this.subscriptionService.adminGetPlanById(dto);
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUBSCRIPTION_PLAN_LIST_FETCHED || 'Plan fetched successfully',
      result,
    );
  }
 
  // USER/ADMIN – UPGRADE SUBSCRIPTION
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.CLIENT, Roles.ADMIN, Roles.COACH, Roles.SUPERADMIN, Roles.SUBADMIN)
  @MessagePattern('upgrade')
  async upgradeSubscription(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    
    const result = await this.subscriptionService.upgradeSubscription(
      context.user._id,
      dto,
      context.user,
    );
 
    return sendResponse(
      true,
      ResponseMessages[langCode]?.SUBSCRIPTION_UPGRADE_SUCCESS || 'Subscription upgraded successfully',
      result,
    );
  }
 
  // USER – PREVIEW UPGRADE COST
@UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.CLIENT, Roles.ADMIN, Roles.COACH, Roles.SUPERADMIN, Roles.SUBADMIN)
  @MessagePattern('preview-upgrade')
  async previewUpgrade(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data ?? payload?.data ?? payload;
    
    const result = await this.subscriptionService.previewUpgrade(
      context.user._id,
      dto,
    );
    
    return sendResponse(
      true,
      ResponseMessages[langCode]?.UPGRADE_PREVIEW_SUCCESS || 'Upgrade preview fetched successfully',
      result,
    );
  }

  // ==========================================
  // AFFILIATE TRANSACTION ENDPOINTS
  // ==========================================

  // ADMIN – GET ALL AFFILIATE TRANSACTIONS (with filters)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @MessagePattern('affiliate-transactions-list')
  async getAffiliateTransactions(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;

    const result = await this.subscriptionService.getAffiliateTransactions(dto);

    return sendResponse(
      true,
      ResponseMessages[langCode]?.AFFILIATE_TRANSACTIONS_FETCHED || 'Affiliate transactions fetched successfully',
      result,
    );
  }

  // ADMIN – GET AFFILIATE TRANSACTION BY ID
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.COACH)
  @MessagePattern('affiliate-transaction-get-by-id')
  async getAffiliateTransactionById(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;

    if (!dto?.transactionId) {
      throw new Error('Transaction ID is required');
    }

    const result = await this.subscriptionService.getAffiliateTransactionById(dto.transactionId);

    return sendResponse(
      true,
      ResponseMessages[langCode]?.AFFILIATE_TRANSACTION_FETCHED || 'Affiliate transaction fetched successfully',
      result,
    );
  }

  // COACH – GET MY AFFILIATE TRANSACTIONS (coach's earnings)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.COACH, Roles.ADMIN, Roles.SUPERADMIN)
  @MessagePattern('affiliate-transactions-my-list')
  async getMyAffiliateTransactions(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    const coachId = context.user._id;

    const result = await this.subscriptionService.getCoachAffiliateTransactions(coachId, dto);

    return sendResponse(
      true,
      ResponseMessages[langCode]?.AFFILIATE_TRANSACTIONS_FETCHED || 'Your affiliate transactions fetched successfully',
      result,
    );
  }

  // COACH – GET MY AFFILIATE SUMMARY (coach's earnings summary)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.COACH, Roles.ADMIN, Roles.SUPERADMIN)
  @MessagePattern('affiliate-transactions-my-summary')
  async getMyAffiliateSummary(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;
    const coachId = context.user._id;

    const result = await this.subscriptionService.getCoachAffiliateSummary(coachId, dto);

    return sendResponse(
      true,
      ResponseMessages[langCode]?.AFFILIATE_SUMMARY_FETCHED || 'Your affiliate summary fetched successfully',
      result,
    );
  }

  // ADMIN – GET COACH AFFILIATE SUMMARY (view specific coach's earnings)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HasRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @MessagePattern('affiliate-transactions-coach-summary')
  async getCoachAffiliateSummary(@Payload() payload: any, @Ctx() context: IContext) {
    const langCode = context?.user?.langCode;
    const dto = payload?.body ?? payload?.data?.body ?? payload?.data ?? payload;

    if (!dto?.coachId) {
      throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.COACHID_IS_REQUIRED || 'Coach ID is required');
    }

    const result = await this.subscriptionService.getCoachAffiliateSummary(dto.coachId, dto);

    return sendResponse(
      true,
      ResponseMessages[langCode]?.AFFILIATE_SUMMARY_FETCHED || 'Coach affiliate summary fetched successfully',
      result,
    );
  }

}
