import { Injectable } from "@nestjs/common";
import {
  CreateCoachDto,
  RemoveCoachDto,
  SearchDto,
  UpdateCoachDto,
} from './dto/coach.dto';
import {
  Roles,
  User,
  UserDocument,
  Role,
  RoleDocument,
  ErrorMessages,
  generateDummyPassword,
  hashPassword,
  EmailService,
  EmailTemplates,
  StatusCodeEnum,
  EmailEnums,
  ILoginUserData,
  S3Service,
  AppLogger,
  LogMessages,
  StripeService,
  Affiliate,
  AffiliateDocument,
} from '@app/common';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { UserService } from '../user.service';

@Injectable()
export class CoachService {
  private readonly logger: AppLogger;
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
    private readonly loggerService: AppLogger,
    private readonly stripeService: StripeService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Affiliate.name) private affiliateModel: Model<AffiliateDocument>,
  ) {
      this.logger = this.loggerService.withContext(CoachService.name);
  }

  /**
   * @description Function to create coach
   * @param data
   * @param loginUser
   * @returns
   */
  async create(data: CreateCoachDto, loginUser: ILoginUserData) {
    try {
      const { userId, companyId,langCode } = loginUser;
      const existingUser: User | null = await this.getByAttribute({
        email: data.email,
        isDeleted: false,
      });
      if (existingUser) {
        this.logger.log(LogMessages.COACH_SERVICE.EMAIL_ALREADY_REGISTERED)
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages[langCode]?.EMAIL_ALREADY_REGISTERED,
        });
      }

      // get roleId of coach
      const getRoleId = await this.getRoleId(Roles.COACH);

      data.createdBy = new Types.ObjectId(userId);
      data.isEmailVerified = true;
      if (data.category) {
        if (typeof data.category === 'string') {
          data.category = [new Types.ObjectId(data.category)];
        } else if (Array.isArray(data.category)) {
          data.category = (data.category as any[]).map((cat: any) => new Types.ObjectId(cat));
        }
      }
      if (data.gender && typeof data.gender === 'string') {
        data.gender = new Types.ObjectId(data.gender);
      }
      data.companyId = new Types.ObjectId(companyId);
      if (getRoleId && getRoleId._id) {
        data.roles = [new Types.ObjectId(getRoleId._id.toString())];
        data.primaryRole = {
          roleId: new Types.ObjectId(getRoleId._id.toString()),
          roleName: getRoleId.role
        };
      }
      if (data.language && typeof data.language === 'string') {
        data.language = new Types.ObjectId(data.language);
      }
      // Create password for new coach
      const password = await generateDummyPassword();
      // Hash the password before saving
      data.password = await hashPassword(password);
      const newUser = new this.userModel(data);
      const response = await newUser.save();

      const company = await this.userService.getCompanyById(
        response.companyId.toString(),
      );
      if (response) {
        // Send welcome email
        try {
          const mailData = {
            name: `${data.firstName} ${data.lastName}`,
            login_url: process.env.LOGIN_URL,
            email: data.email,
            password,
            company_name: company?.companyName ?? process.env.COMPANY_NAME,
            street_address: company?.address?.streetAddress || "",
            city: company?.address?.city || "",
            state: company?.address?.state || "",
            zip_code: company?.address?.zipcode || "",
            country: company?.address?.country || "",
            phone: company?.primaryContact?.primaryMobileNumber || "",
            company_email: company?.primaryContact?.primaryEmail || "",
            user_type: Roles.COACH,
          };
          this.emailService.sendMailTemplate(
            mailData,
            EmailEnums.WELCOME,
            EmailTemplates.WELCOME,
          );
        } catch (emailError) {
          this.logger.error(LogMessages.COACH_SERVICE.EMAIL_WELCOME_ERROR, emailError);
          throw emailError;
        }
      }

      // Prepare response data with required fields
      const responseData = {
        _id: response._id,
        name: `${response.firstName} ${response.lastName}`,
        pic: response.profileImageUrl || null,
        rolename: getRoleId?.role || Roles.COACH,
        gender: response.gender,
        category: response.category,
        email: response.email,

      };

      // Generate presigned URL for profile image if exists
      if (responseData.pic) {
        try {
          responseData.pic = await this.s3Service.getPresignedUrl(responseData.pic);
        } catch (error) {
          this.logger.error('Failed to generate presigned URL for profile image',error);
          responseData.pic = null;
        }
      }
      return responseData;
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_CREATE_COACH, error);
      throw error;
    }
  }

  /**
   * Retrieves the role ID for a coach.
   * @returns A promise that resolves to the found role or null if no role is found.
   */
  async getRoleId(role: Roles) {
    return this.roleModel.findOne({ role }).exec();
  }

  /**
   * @description Function to get user by attribute
   * @param attributes
   * @returns
   */
  async getByAttribute(attributes: object): Promise<User | null> {
    return this.userModel.findOne(attributes).select('-password -stripeCustomerId -stripeConnectAccountId').exec();
  }

  /**
   * @description Function to update coach
   * @param updateCoachDto
   * @param loginUser
   * @returns
   */
  async update(data: UpdateCoachDto, loginUser: ILoginUserData) {
    try {
      const {langCode} = loginUser;
      const existingUser: User | null = await this.getByAttribute({
        _id: data.id,
        isDeleted: false,
      });
      if (!existingUser) {
        this.logger.log(LogMessages.COACH_SERVICE.COACH_NOT_FOUND);
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages[langCode]?.COACH_NOT_FOUND,
        });
      }
      if (data.email) {
        const checkEmailId: User | null = await this.getByAttribute({
          email: data.email,
          isDeleted: false,
        });
        if (checkEmailId && checkEmailId._id != data.id) {
          this.logger.log(LogMessages.COACH_SERVICE.EMAIL_ALREADY_REGISTERED);
          throw new RpcException({
            statusCode: StatusCodeEnum.BAD_REQUEST,
            message: ErrorMessages[langCode]?.EMAIL_ALREADY_REGISTERED,
          });
        }
      }
      if (data.gender && typeof data.gender === 'string') {
        data.gender = new Types.ObjectId(data.gender);
      }
      if (data.category) {
        if (typeof data.category === 'string') {
          data.category = [new Types.ObjectId(data.category)];
        } else if (Array.isArray(data.category)) {
          data.category = (data.category as any[]).map((cat: any) => new Types.ObjectId(cat));
        }
      }
      if (data.language && typeof data.language === 'string') {
        data.language = new Types.ObjectId(data.language);
      }
      data.updatedBy = new Types.ObjectId(loginUser.userId);
      await this.userModel.findOneAndUpdate(
        { _id: data.id },
        { $set: data },
        { new: true },
      );
      return true;
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_UPDATE_COACH, error);
      throw error;
    }
  }

  /**
   * @description Function to remove coach
   * @param removeCoachDto
   * @param loginUser
   * @returns
   */
  async remove(
    removeCoachDto: RemoveCoachDto,
    loginUser: ILoginUserData,
  ): Promise<User | string> {
    try {
      const user = await this.userModel.findOneAndUpdate(
        { _id: removeCoachDto.id },
        {
          $set: {
            isDeleted: true,
            updatedBy: new Types.ObjectId(loginUser.userId),
          },
        },
        { new: true },
      );

      const company = await this.userService.getCompanyById(
        loginUser.companyId.toString(),
      );
      if (user) {
        // send mail to user to inform that you are removed from the application
        const mailData = {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          company_name: company?.companyName ?? process.env.COMPANY_NAME,
          street_address: company?.address?.streetAddress || "",
          city: company?.address?.city || "",
          state: company?.address?.state || "",
          zip_code: company?.address?.zipcode || "",
          country: company?.address?.country || "",
          phone: company?.primaryContact?.primaryMobileNumber || "",
          company_email: company?.primaryContact?.primaryEmail || "",
          user_type: Roles.COACH,
        };
        this.emailService.sendMailTemplate(
          mailData,
          EmailEnums.REMOVE,
          EmailTemplates.REMOVE,
        );
      }
      return user as User;
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_REMOVE_COACH, error);
      throw error;
    }
  }

  /**
   * @description Function to get list of coaches
   * @param searchDto
   * @param loginUser
   * @returns
   */
  async list(searchDto: SearchDto, loginUser: ILoginUserData) {
    try {
      const {
        page = 1,
        search,
        sortField = 'updatedAt',
        sortOrder = 'desc',
        limit = 10,
        categoryId,
      } = searchDto;

      const skip = (page - 1) * limit;
      const sortDirection = sortOrder === 'asc' ? 1 : -1;
      const matchSearch: any = {};

      // Apply search filters if `search` is provided
      if (search) {
        matchSearch.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: `^${search}`, $options: 'i' } },
        ];
      }

      // Fetch coach role ID once and reuse
      const coachRole = await this.getRoleId(Roles.COACH);
      let matchCondition: any = {};
      matchCondition.isDeleted = false;

      // Add company filter to ensure data isolation
      if (loginUser?.companyId) {
        matchCondition.companyId = new Types.ObjectId(loginUser.companyId);
      }

      if (coachRole?._id) {
        matchCondition.roles = new Types.ObjectId(coachRole._id.toString());
      }

      // Apply category filter if provided
      if (categoryId) {
        matchCondition.category = { $in: [new Types.ObjectId(categoryId)] };
      }
      const aggregationPipeline: any = [
        { $match: { ...matchCondition, ...matchSearch } },
        {
          $lookup: {
            from: 'global_codes', // Collection name
            localField: 'category',
            foreignField: '_id',
            as: 'categoryDetails',
          },
        },
        {
          $lookup: {
            from: 'global_codes',
            localField: 'gender',
            foreignField: '_id',
            as: 'genderDetails',
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'roles',
            foreignField: '_id',
            as: 'roleDetails',
          },
        },
        {
          $set: {
            category: '$categoryDetails',
            gender: {
              $ifNull: [{ $arrayElemAt: ['$genderDetails._id', 0] }, null],
            },
            genderName: {
              $ifNull: [{ $arrayElemAt: ['$genderDetails.name', 0] }, null],
            },
            roleName: '$roleDetails.role',
          },
        },
        {
          $project: {
            password: 0,
            stripeCustomerId: 0,
            stripeConnectAccountId: 0,
            categoryDetails: 0,
            genderDetails: 0,
            roleDetails: 0,
          },
        },
        {
          $set: {
            sortFieldLower: { $toLower: `$${sortField}` }, // Convert sort field to lowercase
          },
        },
        { $sort: { sortFieldLower: sortDirection } },
        { $skip: skip },
        { $limit: limit },
      ];

      // Get paginated coach
      const result = await this.userModel.aggregate(aggregationPipeline);

      //presigned url for image
      for (let i = 0; i < result.length; i++) {
        const image = result[i]?.profileImageUrl;
        if (image) {
          const presignedUrl = await this.s3Service.getPresignedUrl(image);
          result[i].profileImageUrl = presignedUrl;
        }
      }

      // Get total count
      const totalPipeline: any = [
        { $match: { ...matchCondition, ...matchSearch } },
        { $count: 'total' },
      ];
      const totalResult = await this.userModel.aggregate(totalPipeline);
      const total = totalResult.length > 0 ? totalResult[0].total : 0;

      return { result, total, page, limit };
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_GET_COACHES, error);
      throw error;
    }
  }

  /**
   * @description Function to get all coaches list for dropdown
   * @param loginUser
   * @returns
   */
  async getAll(loginUser: ILoginUserData) {
    try {
      const { companyId } = loginUser;

      // Fetch coach and admin role IDs in parallel
      const [coachRole, adminRole] = await Promise.all([
        this.getRoleId(Roles.COACH),
        this.getRoleId(Roles.ADMIN),
      ]);

      // If neither role exists, return empty array
      if (!coachRole?._id && !adminRole?._id) {
        return [];
      }

      // Define match conditions - only fetch coaches with a meeting link
      let matchCondition: any = {
        isDeleted: false,
        isActive: true,
        companyId: new Types.ObjectId(companyId),
        meetingLink: { $exists: true, $nin: [null, ''] },
      };

      // Include both coach and admin roles in $or
      matchCondition.$or = [];

      if (coachRole?._id) {
        matchCondition.$or.push({
          roles: new Types.ObjectId(coachRole._id.toString()),
        });
      }

      if (adminRole?._id) {
        matchCondition.$or.push({
          roles: new Types.ObjectId(adminRole._id.toString()),
        });
      }

      // Use aggregation to combine firstName and lastName into "name"
      return await this.userModel.aggregate([
        { $match: matchCondition },
        {
          $project: {
            _id: 1,
            name: { $concat: ['$firstName', ' ', '$lastName'] },
          },
        },
      ]);
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_GET_ALL_COACHES, error);
      throw error;
    }
  }

  /**
   * @description Function to send mail for account status update
   * @param id
   */
  async sendAccountUpdateMail(id: string,loginUser: ILoginUserData) {
    try {
      const { langCode } = loginUser;
      const existingUser: User | null = await this.getByAttribute({
        _id: id,
        isDeleted: false,
      });
      if (!existingUser) {
        this.logger.log(LogMessages.COACH_SERVICE.COACH_NOT_FOUND)
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages[langCode]?.COACH_NOT_FOUND,
        });
      }
      const company = await this.userService.getCompanyById(
        existingUser.companyId.toString(),
      );
      const { firstName, lastName, email, isActive } = existingUser;
      const mailData = {
        name: `${firstName} ${lastName}`,
        email: email,
        login_url: process.env.LOGIN_URL,
        company_name: company?.companyName ?? process.env.COMPANY_NAME,
        street_address: company?.address?.streetAddress || "",
        city: company?.address?.city || "",
        state: company?.address?.state || "",
        zip_code: company?.address?.zipcode || "",
        country: company?.address?.country || "",
        phone: company?.primaryContact?.primaryMobileNumber || "",
        company_email: company?.primaryContact?.primaryEmail || "",
      };

      this.emailService.sendMailTemplate(
        mailData,
        isActive ? EmailEnums.ACTIVE : EmailEnums.DEACTIVE,
        isActive ? EmailTemplates.ACTIVE : EmailTemplates.DEACTIVE,
      );
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_SEND_ACCOUNT_UPDATE_EMAIL, error);
      throw error;
    }
  }

  /**
   * @description Function to get total coach count for dashboard
   * @param loginUser
   * @returns
   */
  async getTotalCoachCount(loginUser: ILoginUserData): Promise<number | null> {
    try {
      const {roleNames} = loginUser;

      // Allow only Admins
      if (!roleNames.includes(Roles.ADMIN)) {
        return 0;
      }

      const coachRole: any = await this.getRoleId(Roles.COACH);
      if (!coachRole) {
        return 0;
      }

      const result = await this.userModel.aggregate([
        {
          $match: {
            isDeleted: false,
            roles: { $in: [coachRole._id] },
          },
        },
        {
          $count: 'total',
        },
      ]);

      return result?.[0]?.total || 0;
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_GET_COUNT_FAILED, error)
      throw error;
    }
  }

  // ==========================================
  // STRIPE CONNECT METHODS
  // ==========================================

  /**
   * Create Stripe Connect account for a coach
   * @param coachId - The coach's user ID
   * @param country - Country code (default: 'US')
   */
  async createConnectAccount(coachId: string, loginUser: ILoginUserData, country: string = 'US') {
    try {
      const { langCode } = loginUser;

      // Find the coach by ID
      const coach = await this.userModel.findById(coachId);

      if (!coach || coach.isDeleted) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages[langCode]?.COACH_NOT_FOUND || 'Coach not found',
        });
      }

      // Verify user is a coach by checking roles array
      const coachRole: any = await this.getRoleId(Roles.COACH);
      if (!coachRole) {
        throw new RpcException({
          statusCode: StatusCodeEnum.INTERNAL_SERVER_ERROR,
          message: 'Coach role not found in system',
        });
      }
      const isCoach = coach.roles?.some(
        (role: any) => role.toString() === coachRole._id.toString()
      );

      if (!isCoach) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: 'User is not a coach',
        });
      }

      // Check if already has Connect account
      if (coach.stripeConnectAccountId) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: 'Coach already has a Stripe Connect account',
        });
      }

      // Create Stripe Connect account
      const account = await this.stripeService.createConnectAccount(
        coach.email,
        coach.firstName,
        coach.lastName,
        country,
      );

      // Save Connect account ID to coach
      await this.userModel.findByIdAndUpdate(coachId, {
        stripeConnectAccountId: account.id,
        stripeConnectOnboardingComplete: false,
      });

      return {
        accountId: account.id,
        coachId: coach._id,
        coachName: `${coach.firstName} ${coach.lastName}`,
        message: 'Stripe Connect account created. Coach needs to complete onboarding.',
      };
    } catch (error: any) {
      this.logger.error('Failed to create Connect account for coach', error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        statusCode: StatusCodeEnum.INTERNAL_SERVER_ERROR,
        message: error?.message || 'Failed to create Stripe Connect account',
      });
    }
  }
  // Affiliate methods
  async createAffiliate(createAffiliateDto: any, userId: Types.ObjectId) {
    try {
      const existingAffiliate = await this.affiliateModel.findOne({ 
        coachId: createAffiliateDto.coachId,
        isActive: true,
        isDeleted: false
      });

      if (existingAffiliate) {
        this.logger.error(LogMessages.COACH_SERVICE.AFFILIATE_ALREADY_EXISTS);
        throw new RpcException({
          statusCode: StatusCodeEnum.CONFLICT,
          message: ErrorMessages.en.AFFILIATE_ALREADY_EXISTS,
        });
      }

      const affiliate = new this.affiliateModel({
        coachId: createAffiliateDto.coachId,
        coachPercentage: createAffiliateDto.coachPercentage,
        affiliateLink: createAffiliateDto.affiliateLink,
        createdBy: userId,
      });

      const savedAffiliate = await affiliate.save();

      // Send confirmation email to coach
      await this.sendAffiliateConfirmationEmail(createAffiliateDto.coachId, createAffiliateDto.affiliateLink);

      return savedAffiliate;
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_CREATE_AFFILIATE, error);
      throw error;
    }
  }

  /**
   * Get onboarding link for coach to complete Stripe Connect setup
   * @param coachId - The coach's user ID
   */
  async getConnectOnboardingLink(coachId: string, loginUser: ILoginUserData) {
    try {
      const { langCode } = loginUser;

      const coach = await this.userModel.findOne({
        _id: new Types.ObjectId(coachId),
        isDeleted: false,
      });

      if (!coach) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages[langCode]?.COACH_NOT_FOUND || 'Coach not found',
        });
      }

      if (!coach.stripeConnectAccountId) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: 'Coach does not have a Stripe Connect account. Create one first.',
        });
      }

      const apiUrl = this.configService.get<string>('API_URL') || 'http://localhost:3000';
      const stripeRefreshPath = this.configService.get<string>('STRIPE_CONNECT_REFRESH_PATH') || '/coach/stripe-refresh';
      const stripeCompletePath = this.configService.get<string>('STRIPE_CONNECT_COMPLETE_PATH') || '/coach/stripe-complete';

      const onboardingLink = await this.stripeService.createConnectOnboardingLink(
        coach.stripeConnectAccountId,
        `${apiUrl}${stripeRefreshPath}?coachId=${coachId}`,
        `${apiUrl}${stripeCompletePath}?coachId=${coachId}`,
      );

      return {
        url: onboardingLink.url,
        expiresAt: new Date(onboardingLink.expires_at * 1000),
        coachId: coach._id,
      };
    } catch (error: any) {
      this.logger.error('Failed to get Connect onboarding link', error);
      throw error;
    }
  }

  /**
   * Check coach's Stripe Connect account status
   * @param coachId - The coach's user ID
   */
  async getConnectStatus(coachId: string, loginUser: ILoginUserData) {
    try {
      const { langCode } = loginUser;

      const coach = await this.userModel.findOne({
        _id: new Types.ObjectId(coachId),
        isDeleted: false,
      });

      if (!coach) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages[langCode]?.COACH_NOT_FOUND || 'Coach not found',
        });
      }

      if (!coach.stripeConnectAccountId) {
        return {
          hasConnectAccount: false,
          isOnboarded: false,
          message: 'Coach does not have a Stripe Connect account',
        };
      }

      const status = await this.stripeService.getConnectAccountStatus(
        coach.stripeConnectAccountId,
      );

      // Handle case where account was not found (credential change)
      if (status.accountNotFound) {
        this.logger.warn(`Connect account ${coach.stripeConnectAccountId} not found for coach ${coachId} - clearing invalid data`);
        // Clear the invalid Connect account data
        await this.userModel.findByIdAndUpdate(coachId, {
          $unset: { stripeConnectAccountId: '', stripeConnectOnboardingComplete: '' },
        });

        return {
          hasConnectAccount: false,
          isOnboarded: false,
          accountNotFound: true,
          message: 'Stripe Connect account needs to be set up again. Please complete the onboarding process.',
          requiresReOnboarding: true,
        };
      }

      // Update onboarding status in database if changed
      if (status.isOnboarded && !coach.stripeConnectOnboardingComplete) {
        await this.userModel.findByIdAndUpdate(coachId, {
          stripeConnectOnboardingComplete: true,
        });
      }

      // If not onboarded yet, generate a new onboarding link so user can continue
      let onboardingUrl: string | null = null;
      let onboardingExpiresAt: Date | null = null;
      if (!status.isOnboarded && coach.stripeConnectAccountId) {
        try {
          const apiUrl = this.configService.get<string>('API_URL') || 'http://localhost:3000';
          const stripeRefreshPath = this.configService.get<string>('STRIPE_CONNECT_REFRESH_PATH') || '/coach/stripe-refresh';
          const stripeCompletePath = this.configService.get<string>('STRIPE_CONNECT_COMPLETE_PATH') || '/coach/stripe-complete';
          const onboardingLink = await this.stripeService.createConnectOnboardingLink(
            coach.stripeConnectAccountId,
            `${apiUrl}${stripeRefreshPath}?coachId=${coachId}`,
            `${apiUrl}${stripeCompletePath}?coachId=${coachId}`,
          );
          onboardingUrl = onboardingLink.url;
          onboardingExpiresAt = new Date(onboardingLink.expires_at * 1000);
        } catch (linkError) {
          this.logger.error('Failed to generate onboarding link in getConnectStatus', linkError);
        }
      }

      return {
        hasConnectAccount: true,
        stripeConnectAccountId: coach.stripeConnectAccountId,
        ...status,
        onboardingUrl,
        onboardingExpiresAt,
        message: status.isOnboarded
          ? 'Coach can receive payments'
          : 'Coach needs to complete onboarding',
      };
    } catch (error: any) {
      this.logger.error('Failed to get Connect status', error);
      throw error;
    }
  }

  /**
   * Clear Stripe Connect account data for a coach
   * Used when credentials change or account needs to be reset
   * @param coachId - The coach's user ID
   */
  async clearConnectAccount(coachId: string, loginUser: ILoginUserData) {
    try {
      const { langCode } = loginUser;

      const coach = await this.userModel.findOne({
        _id: new Types.ObjectId(coachId),
        isDeleted: false,
      });

      if (!coach) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages[langCode]?.COACH_NOT_FOUND || 'Coach not found',
        });
      }

      await this.userModel.findByIdAndUpdate(coachId, {
        $unset: {
          stripeConnectAccountId: '',
          stripeConnectOnboardingComplete: '',
        },
      });

      this.logger.log(`Cleared Stripe Connect data for coach ${coachId}`);

      return {
        success: true,
        coachId,
        message: 'Stripe Connect account data cleared. Coach can now create a new Connect account.',
      };
    } catch (error: any) {
      this.logger.error('Failed to clear Connect account', error);
    }
  }
  async findAllAffiliates(searchDto?: SearchDto) {
    try {
      if (!searchDto) {
        return this.affiliateModel.find({ 
          isActive: true,
          isDeleted: false 
        }).populate('coachId', 'firstName lastName email').exec();
      }

      const {
        page = 1,
        search,
        sortField = 'updatedAt',
        sortOrder = 'desc',
        limit = 10,
      } = searchDto;

      const skip = (page - 1) * limit;
      const sortDirection = sortOrder === 'asc' ? 1 : -1;
      
      let matchCondition: any = {
        isDeleted: false
      };

      const aggregationPipeline: any = [
        { $match: matchCondition },
        {
          $addFields: {
            coachObjectId: { $toObjectId: "$coachId" }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'coachObjectId',
            foreignField: '_id',
            as: 'coachDetails'
          }
        },
        {
          $unwind: '$coachDetails'
        }
      ];

      // Add search filter if provided
      if (search) {
        aggregationPipeline.push({
          $match: {
            $or: [
              { 'coachDetails.firstName': { $regex: search, $options: 'i' } },
              { 'coachDetails.lastName': { $regex: search, $options: 'i' } },
              { 'coachDetails.email': { $regex: search, $options: 'i' } }
            ]
          }
        });
      }

      // Add sorting, skip, and limit
      aggregationPipeline.push(
        { $sort: { [sortField]: sortDirection } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            coachId: {
              _id: '$coachDetails._id',
              firstName: '$coachDetails.firstName',
              lastName: '$coachDetails.lastName',
              email: '$coachDetails.email'
            },
            coachPercentage: 1,
            affiliateLink: 1,
            isActive: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      );

      // Get paginated results
      const result = await this.affiliateModel.aggregate(aggregationPipeline);

      // Get total count with same search conditions
      const countPipeline: any[] = [
        { $match: matchCondition },
        {
          $addFields: {
            coachObjectId: { $toObjectId: "$coachId" }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'coachObjectId',
            foreignField: '_id',
            as: 'coachDetails'
          }
        },
        { $unwind: '$coachDetails' }
      ];

      if (search) {
        countPipeline.push({
          $match: {
            $or: [
              { 'coachDetails.firstName': { $regex: search, $options: 'i' } },
              { 'coachDetails.lastName': { $regex: search, $options: 'i' } },
              { 'coachDetails.email': { $regex: search, $options: 'i' } }
            ]
          }
        });
      }

      countPipeline.push({ $count: 'total' });
      const totalResult = await this.affiliateModel.aggregate(countPipeline);
      const total = totalResult.length > 0 ? totalResult[0].total : 0;

      return { result, total, page, limit };
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_GET_AFFILIATES, error);
      throw error;
    }
  }

  async findAffiliateByCoachId(coachId: Types.ObjectId) {
    try {
      const affiliate = await this.affiliateModel.findOne({ 
        coachId: coachId.toString(),
        isDeleted: false 
      }).exec();
      
      if (!affiliate) {
        this.logger.error(LogMessages.COACH_SERVICE.AFFILIATE_NOT_FOUND);
        throw new RpcException({
          statusCode: StatusCodeEnum.NOT_FOUND,
          message: ErrorMessages.en.AFFILIATE_NOT_FOUND,
        });
      }

      return affiliate;
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_GET_AFFILIATE, error);
      throw error;
    }
  }

  async updateAffiliate(coachId: Types.ObjectId, updateAffiliateDto: any, userId: Types.ObjectId) {
    try {
      const updateData = { updatedBy: userId };
      if (updateAffiliateDto.coachPercentage !== undefined) {
        updateData['coachPercentage'] = Number(updateAffiliateDto.coachPercentage);
      }
      if (updateAffiliateDto.affiliateLink !== undefined) {
        updateData['affiliateLink'] = updateAffiliateDto.affiliateLink;
      }
      if (updateAffiliateDto.isActive !== undefined) {
        updateData['isActive'] = updateAffiliateDto.isActive;
      }

      const affiliate = await this.affiliateModel.findOneAndUpdate(
        { coachId: coachId.toString(), isDeleted: false },
        { $set: updateData },
        { new: true }
      ).exec();

      if (!affiliate) {
        this.logger.error(LogMessages.COACH_SERVICE.AFFILIATE_NOT_FOUND);
        throw new RpcException({
          statusCode: StatusCodeEnum.NOT_FOUND,
          message: ErrorMessages.en.AFFILIATE_NOT_FOUND,
        });
      }

      return affiliate;
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_UPDATE_AFFILIATE, error);
      throw error;
    }
  }

  async removeAffiliate(coachId: Types.ObjectId) {
    try {
      const result = await this.affiliateModel.findOneAndUpdate(
        { coachId: coachId.toString(), isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true }
      );

      if (!result) {
        this.logger.error(LogMessages.COACH_SERVICE.AFFILIATE_NOT_FOUND);
        throw new RpcException({
          statusCode: StatusCodeEnum.NOT_FOUND,
          message: ErrorMessages.en.AFFILIATE_NOT_FOUND,
        });
      }
    } catch (error) {
      this.logger.error(LogMessages.COACH_SERVICE.FAILED_TO_REMOVE_AFFILIATE, error);
      throw error;
    }
  }

  /**
   * Get Stripe Express dashboard link for coach
   * @param coachId - The coach's user ID
   */
  async getConnectDashboardLink(coachId: string, loginUser: ILoginUserData) {
    try {
      const { langCode } = loginUser;

      const coach = await this.userModel.findOne({
        _id: new Types.ObjectId(coachId),
        isDeleted: false,
      });

      if (!coach) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: ErrorMessages[langCode]?.COACH_NOT_FOUND || 'Coach not found',
        });
      }

      if (!coach.stripeConnectAccountId) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: 'Coach does not have a Stripe Connect account',
        });
      }

      if (!coach.stripeConnectOnboardingComplete) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: 'Coach must complete onboarding before accessing dashboard',
        });
      }

      const loginLink = await this.stripeService.createConnectLoginLink(
        coach.stripeConnectAccountId,
      );

      return {
        url: loginLink.url,
        coachId: coach._id,
      };
    } catch (error: any) {
      this.logger.error('Failed to get Connect dashboard link', error);
      throw error;
    }
  }
  //  * @description Function to get all stripe connected users with pagination
  //  * @param searchDto - Search and pagination parameters
  //  * @param loginUser
  //  * @returns
  //  */
  async getStripeConnectedCoaches(searchDto: SearchDto, loginUser: ILoginUserData) {
    try {
      const { companyId } = loginUser;
      
      const {
        page = 1,
        search,
        sortField = 'updatedAt',
        sortOrder = 'desc',
        limit = 10,
      } = searchDto;

      const skip = (page - 1) * limit;
      const sortDirection = sortOrder === 'asc' ? 1 : -1;

      let matchCondition: any = {
        isDeleted: false,
        isActive: true,
        stripeConnectOnboardingComplete: true,
        companyId: new Types.ObjectId(companyId)
      };

      // Add search filter if provided
      if (search) {
        matchCondition.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const aggregationPipeline: any = [
        { $match: matchCondition },
        { $sort: { [sortField]: sortDirection } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            name: { $concat: ['$firstName', ' ', '$lastName'] },
            firstName: 1,
            lastName: 1,
            email: 1,
            stripeConnectOnboardingComplete: 1,
            primaryRole: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
      ];

      // Get paginated results
      const result = await this.userModel.aggregate(aggregationPipeline);

      // Get total count
      const totalResult = await this.userModel.aggregate([
        { $match: matchCondition },
        { $count: 'total' }
      ]);
      const total = totalResult.length > 0 ? totalResult[0].total : 0;

      return { result, total, page, limit };
    } catch (error) {
      this.logger.error('Failed to get stripe connected users', error);
      throw error;
    }
  }

  /**
   * @description Send affiliate confirmation email to coach
   * @param coachId - ID of the coach
   * @param affiliateLink - The affiliate link
   */
  private async sendAffiliateConfirmationEmail(coachId: string, affiliateLink: string) {
    try {
      const coach = await this.userModel.findById(coachId).select('firstName lastName email companyId').exec();
      
      if (!coach) {
        this.logger.error('Coach not found for affiliate email');
        return;
      }

      let company: any = null;
      try {
        if (coach.companyId) {
          company = await this.userService.getCompanyById(coach.companyId.toString());
        }
      } catch (companyError) {
        this.logger.warn('Company not found for coach, using default values');
        company = null;
      }
      
      const mailData = {
        name: `${coach.firstName} ${coach.lastName}`,
        email: coach.email,
        affiliate_link: affiliateLink,
        company_name: company?.companyName ?? 'Happy Whole Human',
        street_address: company?.address?.streetAddress || "",
        city: company?.address?.city || "",
        state: company?.address?.state || "",
        zip_code: company?.address?.zipcode || "",
        country: company?.address?.country || "",
        phone: company?.primaryContact?.primaryMobileNumber || "",
        company_email: company?.primaryContact?.primaryEmail || "",
      };

      this.emailService.sendMailTemplate(
        mailData,
        EmailEnums.AFFILIATE_CONFIRMATION,
        EmailTemplates.AFFILIATE_CONFIRMATION,
      );
    } catch (error) {
      this.logger.error('Failed to send affiliate confirmation email', error);
      // Don't throw error to avoid breaking affiliate creation
    }
  }
}
