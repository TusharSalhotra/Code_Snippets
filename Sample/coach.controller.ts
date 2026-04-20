import { Controller, UsePipes, UseGuards } from '@nestjs/common';
import { CoachService } from './coach.service';
import {
  CreateCoachDto,
  RemoveCoachDto,
  UpdateCoachDto,
  GetCoachDto,
  SearchDto,
  CreateAffiliateDto,
  UpdateAffiliateDto,
} from './dto/coach.dto';
import {
  sendResponse,
  ResponseMessages,
  JoiValidationPipe,
  ErrorMessages,
  StatusCodeEnum,
  JwtAuthGuard,
  IContext,
  RoleGuard,
  HasRoles,
  Roles,
} from '@app/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import {
  createCoachSchema,
  getCoachSchema,
  removeCoachSchema,
  searchDtoSchema,
  updateCoachSchema,
  updateCoachStatusSchema,
  createAffiliateValidation,
  updateAffiliateValidation,
  getAffiliateValidation,
} from './validations/coach.validation';
import { Types } from 'mongoose';

@Controller('coach')
@UseGuards(JwtAuthGuard,RoleGuard)
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  /**
   * @description Function to create coach
   * @param createCoachDto
   * @param context
   * @returns
   */
  @HasRoles(Roles.ADMIN)
  @MessagePattern('create-coach')
  @UsePipes(new JoiValidationPipe(createCoachSchema))
  async create(
    @Payload() createCoachDto: CreateCoachDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
   const coach= await this.coachService.create(createCoachDto, user);
    return sendResponse(true, ResponseMessages[langCode]?.ADD_COACH_SUCCESS,coach);
  }

  /**
   * @description Function to update coach
   * @param updateCoachDto
   * @param context
   * @returns
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('update-coach')
  @UsePipes(new JoiValidationPipe(updateCoachSchema))
  async update(
    @Payload() updateCoachDto: UpdateCoachDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    await this.coachService.update(updateCoachDto, user);
    return sendResponse(true, ResponseMessages[langCode]?.UPDATE_COACH_SUCCESS);
  }

  /**
   * @description Function to remove coach
   * @param removeCoachDto
   * @param context
   * @returns
   */
  @HasRoles(Roles.ADMIN)
  @MessagePattern('remove-coach')
  @UsePipes(new JoiValidationPipe(removeCoachSchema))
  async remove(
    @Payload() removeCoachDto: RemoveCoachDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    await this.coachService.remove(removeCoachDto, user);
    return sendResponse(true, ResponseMessages[langCode]?.REMOVE_COACH_SUCCESS);
  }

  /**
   * @description Function to update staus of coach
   * @param param0
   * @param context
   * @returns
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('update-coach-status')
  @UsePipes(new JoiValidationPipe(updateCoachStatusSchema))
  async toggleStatus(
    @Payload() { id, isActive }: { id: string; isActive: boolean },
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    await this.coachService.update({ id, isActive }, user);
    this.coachService.sendAccountUpdateMail(id,user);
    return sendResponse(
      true,
      isActive
        ? ResponseMessages[langCode]?.COACH_ACTIVATED
        : ResponseMessages[langCode]?.COACH_DEACTIVATED,
    );
  }

  /**
   * @description Function to get coach information
   * @param getCoachDto
   * @param context
   * @returns
   */

  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('get-coach')
  @UsePipes(new JoiValidationPipe(getCoachSchema))
  async getCoachInfo(
    @Payload() getCoachDto: GetCoachDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    const coach = await this.coachService.getByAttribute({
      _id: getCoachDto.id,
      isDeleted: false,
    });
    if (!coach) {
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: ErrorMessages[langCode]?.COACH_NOT_FOUND,
      });
    }
    return sendResponse(
      true,
      ResponseMessages[langCode]?.FETCH_COACHES_SUCCESS,
      coach,
    );
  }

  /**
   * @description Function to get list of coaches
   * @param searchDto
   * @param context
   * @returns
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('list-coach')
  @UsePipes(new JoiValidationPipe(searchDtoSchema))
  async listCoachs(
    @Payload() searchDto: SearchDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    const coachs = await this.coachService.list(searchDto, user);
    return sendResponse(
      true,
      ResponseMessages[langCode]?.FETCH_COACHES_SUCCESS,
      coachs,
    );
  }

  /**
   * @description Function to get all coaches list for dropdowns
   * @param context
   * @returns
   */
  @HasRoles(Roles.ADMIN, Roles.COACH, Roles.SUBADMIN)
  @MessagePattern('all-coach')
  async listAllCoachs(@Ctx() context: IContext) {
    const { user } = context;
    const langCode = user.langCode;
    const coachs = await this.coachService.getAll(user);
    return sendResponse(
      true,
      ResponseMessages[langCode]?.FETCH_COACHES_SUCCESS,
      coachs,
    );
  }

  // ==========================================
  // STRIPE CONNECT ENDPOINTS
  // ==========================================

  /**
   * Create Stripe Connect account for a coach
   * POST /coach/create-connect-account
   * Body: { coachId: string, country?: string }
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN, Roles.COACH)
  @MessagePattern('create-coach-connect-account')
  async createConnectAccount(
    @Payload() payload: any,
    @Ctx() context: IContext,
  ) {
    const { user } = context;

    // Extract from payload.body (gateway wraps request in { headers, body, method, path })
    const body = payload?.body || payload;
    const coachId = body?.coachId;
    const country = body?.country || 'US';

    const result = await this.coachService.createConnectAccount(
      coachId,
      user,
      country,
    );
    return sendResponse(true, 'Stripe Connect account created successfully', result);
  }

  /**
   * Get onboarding link for coach to complete Stripe Connect setup
   * POST /coach/get-connect-onboarding-link
   * Body: { coachId: string }
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN, Roles.COACH)
  @MessagePattern('get-coach-connect-onboarding-link')
  async getConnectOnboardingLink(
    @Payload() payload: any,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const body = payload?.body || payload;
    const result = await this.coachService.getConnectOnboardingLink(body?.coachId, user);
    return sendResponse(true, 'Onboarding link generated successfully', result);
  }

  /**
   * Check coach's Stripe Connect account status
   * POST /coach/get-connect-status
   * Body: { coachId: string }
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN, Roles.COACH)
  @MessagePattern('get-coach-connect-status')
  async getConnectStatus(
    @Payload() payload: any,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const body = payload?.body || payload;
    const result = await this.coachService.getConnectStatus(body?.coachId, user);
    return sendResponse(true, 'Connect status retrieved successfully', result);
  }

  /**
   * Get Stripe Express dashboard link for coach
   * POST /coach/get-connect-dashboard-link
   * Body: { coachId: string }
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN, Roles.COACH)
  @MessagePattern('get-coach-connect-dashboard-link')
  async getConnectDashboardLink(
    @Payload() payload: any,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const body = payload?.body || payload;
    const result = await this.coachService.getConnectDashboardLink(body?.coachId, user);
    return sendResponse(true, 'Dashboard link generated successfully', result);
  }

  /**
   * Clear Stripe Connect account data for coach
   * Used when Stripe credentials change and account needs to be reset
   * POST /coach/clear-connect-account
   * Body: { coachId: string }
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('clear-coach-connect-account')
  async clearConnectAccount(
    @Payload() payload: any,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const body = payload?.body || payload;
    const result = await this.coachService.clearConnectAccount(body?.coachId, user);
    return sendResponse(true, 'Stripe Connect account data cleared successfully', result);
  }
  // Affiliate endpoints
  
  /**
   * @description Function to create affiliate for a coach
   * @param createAffiliateDto - Affiliate creation data
   * @param context - Request context with user information
   * @returns Success response with created affiliate data
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('create-affiliate')
  @UsePipes(new JoiValidationPipe(createAffiliateValidation))
  async createAffiliate(
    @Payload() createAffiliateDto: CreateAffiliateDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    const affiliate = await this.coachService.createAffiliate(createAffiliateDto, new Types.ObjectId(user.userId));
    return sendResponse(true, ResponseMessages[langCode]?.ADD_AFFILIATE_SUCCESS || 'Affiliate created successfully', affiliate);
  }

  /**
   * @description Function to get list of all affiliates
   * @param searchDto - Search and pagination parameters
   * @param context - Request context with user information
   * @returns Success response with list of affiliates
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('list-affiliate')
  @UsePipes(new JoiValidationPipe(searchDtoSchema))
  async findAllAffiliates(
    @Payload() searchDto: SearchDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    const affiliates = await this.coachService.findAllAffiliates(searchDto);
    return sendResponse(true, ResponseMessages[langCode]?.FETCH_AFFILIATES_SUCCESS || 'Affiliates fetched successfully', affiliates);
  }

  /**
   * @description Function to get affiliate details by coach ID
   * @param coachId - ID of the coach to get affiliate for
   * @param context - Request context with user information
   * @returns Success response with affiliate data
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('get-affiliate')
  @UsePipes(new JoiValidationPipe(getAffiliateValidation))
  async findAffiliateByCoachId(
    @Payload() { coachId }: { coachId: string },
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    const affiliate = await this.coachService.findAffiliateByCoachId(new Types.ObjectId(coachId));
    return sendResponse(true, ResponseMessages[langCode]?.FETCH_AFFILIATE_SUCCESS || 'Affiliate fetched successfully', affiliate);
  }

  /**
   * @description Function to update affiliate details
   * @param updateData - Update data containing coachId and affiliate fields to update
   * @param context - Request context with user information
   * @returns Success response confirming update
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('update-affiliate')
  @UsePipes(new JoiValidationPipe(updateAffiliateValidation))
  async updateAffiliate(
    @Payload() updateData: { coachId: string } & UpdateAffiliateDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    const { coachId, ...updateAffiliateDto } = updateData;
    await this.coachService.updateAffiliate(
      new Types.ObjectId(coachId),
      updateAffiliateDto,
      new Types.ObjectId(user.userId)
    );
    return sendResponse(true, ResponseMessages[langCode]?.UPDATE_AFFILIATE_SUCCESS || 'Affiliate updated successfully');
  }

  
  /**
   * @description Function to remove/delete affiliate by coach ID
   * @param coachId - ID of the coach to remove affiliate for
   * @param context - Request context with user information
   * @returns Success response confirming removal
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('remove-affiliate')
  @UsePipes(new JoiValidationPipe(getAffiliateValidation))
  async removeAffiliate(
    @Payload() { coachId }: { coachId: string },
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    await this.coachService.removeAffiliate(new Types.ObjectId(coachId));
    return sendResponse(true, ResponseMessages[langCode]?.REMOVE_AFFILIATE_SUCCESS || 'Affiliate removed successfully');
  }
  
  /**
   * @description Function to get all stripe connected coaches
   * @param searchDto - Search and pagination parameters
   * @param context - Request context with user information
   * @returns Success response with list of stripe connected coaches
   */
  @HasRoles(Roles.ADMIN, Roles.SUBADMIN)
  @MessagePattern('stripe-connected-coaches')
  @UsePipes(new JoiValidationPipe(searchDtoSchema))
  async getStripeConnectedCoaches(
    @Payload() searchDto: SearchDto,
    @Ctx() context: IContext,
  ) {
    const { user } = context;
    const langCode = user.langCode;
    const coaches = await this.coachService.getStripeConnectedCoaches(searchDto, user);
    return sendResponse(true, ResponseMessages[langCode]?.FETCH_COACHES_SUCCESS || 'Stripe connected coaches fetched successfully', coaches);
  }
}
