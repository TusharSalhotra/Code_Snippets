
import {
  NATS_URL,
  STRIPE_SECRET_KEY,
  LOAD_TEST_ENABLED,
  STRIPE_PUBLISHABLE_KEY,
} from './env';

const tracer = new Tracer('StripeService');
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export default class StripeService extends BaseService {

  public proxy: IServiceProxy;

  constructor(opts) {
    super(opts);
    this.proxy = proxyProvider(this.connectionMgr);
  }
  public static main() {
    const serviceName = pb.StripeService.name;
    const logger = new ConsoleLogManager({
      serviceName,
    });
    const service = new StripeService({
      serviceName,
      connectionMgr: new NatsConnectionManager([<string>NATS_URL], logger, true),
      logManager: logger,
    });
    service.run();
  }
  public run() {
    this.connectionMgr.connect();
    this.connectionMgr.on('connect', () => {
      this.register();
      this.logger.info(`Service instance ${this.serviceName} is running...`);
    });
  }
  public register() {
    this.connectionMgr.subscribe(this.serviceName, 'api', {
      /**
       * Incoming Message Handlers
       */
      // Connect
      connectStripeUser: new PbMessageHandler(
        this.connectStripeUser,
        pb.ConnectStripeUserRequest,
        pb.ConnectStripeUserResponse,
      ),
      retrieveStripeConnectAccount: new PbMessageHandler(
        this.retrieveStripeConnectAccount,
        pb.RetrieveStripeConnectAccountRequest,
        pb.RetrieveStripeConnectAccountResponse,
      ),
      // Charge
      createStripeCharge: new PbMessageHandler(
        this.createStripeCharge,
        pb.CreateStripeChargeRequest,
        pb.CreateStripeChargeResponse,
      ),
      refundStripeCharge: new PbMessageHandler(
        this.refundStripeCharge,
        pb.RefundStripeChargeRequest,
        pb.RefundStripeChargeResponse,
      ),
      retrieveStripeCharge: new PbMessageHandler(
        this.retrieveStripeCharge,
        pb.RetrieveStripeChargeRequest,
        pb.RetrieveStripeChargeResponse,
      ),
      // Customer
      createStripeCustomer: new PbMessageHandler(
        this.createStripeCustomer,
        pb.CreateStripeCustomerRequest,
        pb.CreateStripeCustomerResponse,
      ),
      retrieveStripeCustomer: new PbMessageHandler(
        this.retrieveStripeCustomer,
        pb.RetrieveStripeCustomerRequest,
        pb.RetrieveStripeCustomerResponse,
      ),
      updateStripeCustomer: new PbMessageHandler(
        this.updateStripeCustomer,
        pb.UpdateStripeCustomerRequest,
        pb.UpdateStripeCustomerResponse,
      ),
      createStripeSource: new PbMessageHandler(
        this.createStripeSource,
        pb.CreateStripeSourceRequest,
        pb.CreateStripeSourceResponse,
      ),
      deleteStripeSource: new PbMessageHandler(
        this.deleteStripeSource,
        pb.DeleteStripeSourceRequest,
        pb.DeleteStripeSourceResponse,
      ),
      // Payment Method
      createStripeSetupIntent: new PbMessageHandler(
        this.createStripeSetupIntent,
        pb.CreateStripeSetupIntentRequest,
        pb.CreateStripeSetupIntentResponse,
      ),
      attachStripePaymentMethod: new PbMessageHandler(
        this.attachStripePaymentMethod,
        pb.AttachStripePaymentMethodRequest,
        pb.AttachStripePaymentMethodResponse,
      ),
      getStripeCardByMethod: new PbMessageHandler(
        this.getStripeCardByMethod,
        pb.GetStripeCardByMethodRequest,
        pb.GetStripeCardByMethodResponse,
      ),
      // Terminal
      registerStripeTerminalReader: new PbMessageHandler(
        this.registerStripeTerminalReader,
        pb.RegisterStripeTerminalReaderRequest,
        pb.RegisterStripeTerminalReaderResponse,
      ),
      listStripeTerminalReaders: new PbMessageHandler(
        this.listStripeTerminalReaders,
        pb.ListStripeTerminalReadersRequest,
        pb.ListStripeTerminalReadersResponse,
      ),
      deleteStripeTerminalReader: new PbMessageHandler(
        this.deleteStripeTerminalReader,
        pb.DeleteStripeTerminalReaderRequest,
        pb.DeleteStripeTerminalReaderResponse,
      ),
      createStripeTerminalConnectionToken: new PbMessageHandler(
        this.createStripeTerminalConnectionToken,
        pb.CreateStripeTerminalConnectionTokenRequest,
        pb.CreateStripeTerminalConnectionTokenResponse,
      ),
      createStripeLocationId: new PbMessageHandler(
        this.createStripeLocationId,
        pb.CreateStripeTerminalConnectionTokenRequest,
        pb.CreateStripeLocationIdResponse,
      ),
      // Payment Intent
      createStripePaymentIntent: new PbMessageHandler(
        this.createStripePaymentIntent,
        pb.CreateStripePaymentIntentRequest,
        pb.CreateStripePaymentIntentResponse,
      ),
      captureStripePaymentIntent: new PbMessageHandler(
        this.captureStripePaymentIntent,
        pb.CaptureStripePaymentIntentRequest,
        pb.CaptureStripePaymentIntentResponse,
      ),
      cancelStripePaymentIntent: new PbMessageHandler(
        this.cancelStripePaymentIntent,
        pb.CancelStripePaymentIntentRequest,
        pb.CancelStripePaymentIntentResponse,
      ),
      retrieveStripeChargeByIntent: new PbMessageHandler(
        this.retrieveStripeChargeByIntent,
        pb.RetrieveStripeChargeByIntentsRequest,
        pb.RetrieveStripeChargeByIntentsResponse,
      ), stripePublishKey: new PbMessageHandler(
        this.stripePublishKey,
        pb.RetrieveStripeChargeRequest,
        pb.StripePublishKeyByResponse
      ), resetStripeConnection: new PbMessageHandler(
        this.resetStripeConnection,
        pb.ResetStripeConnectionRequest,
        pb.ResetStripeConnectionResponse
      ),
    });
  }

  private toPbStripeConnectAccount(stripeConnectAccount: any): any {
    if (!stripeConnectAccount) {
      return new pb.StripeConnectAccount();
    }

    return pb.StripeConnectAccount.create({
      name: stripeConnectAccount.business_name,
      country: stripeConnectAccount.country,
      email: stripeConnectAccount.email,
      payoutsEnabled: stripeConnectAccount.payouts_enabled,
      stripeAccountId: stripeConnectAccount.id,
    });

  }

  private toPbStripeCustomer(stripeCustomer: any, stripePaymentMethods?: any): any {
    if (!stripeCustomer) {
      return new pb.StripeCustomer();
    }

    return pb.StripeCustomer.create({
      stripeCustomerId: stripeCustomer.id,
      email: stripeCustomer.email,
      paymentMethods: stripePaymentMethods?.map(paymentMethod => {
        return this.toPbStripePaymentMethod(paymentMethod)
      }) ?? [],
    });

  }

  private toPbStripePaymentMethod(stripePaymentMethod: any): any {
    if (!stripePaymentMethod) {
      return new pb.StripPaymentMethod();
    }

    return pb.StripePaymentMethod.create({
      paymentMethodId: stripePaymentMethod.id.toString(),
      brand: stripePaymentMethod.card.brand.toString(),
      last4: stripePaymentMethod.card.last4.toString(),
      expMonth: stripePaymentMethod.card.exp_month.toString(),
      expYear: stripePaymentMethod.card.exp_year.toString(),
      funding: stripePaymentMethod.card.funding.toString(),
      country: stripePaymentMethod.card.country.toString(),
      type: stripePaymentMethod.type.toString(),
    });
  }

  private toPbStripeTerminalReader(reader: any): IStripeTerminalReader {
    if (!reader) {
      return new pb.StripeTerminalReader();
    }

    return pb.StripeTerminalReader.create({
      id: reader.id,
      label: reader.label,
      type: reader.device_type,
      location: reader.location,
      serialNumber: reader.serial_number,
      status: reader.status,
      ipAddress: reader.ip_address,
    });
  }
  /****************************************************************************************
    Stripe Connect
  ****************************************************************************************/

  public connectStripeUser = async (request: pb.ConnectStripeUserRequest): Promise<pb.ConnectStripeUserReponse> => {
    const span = tracer.startSpan('connectStripeUser', request.spanContext);
    const response: pb.ConnectStripeUserResponse = pb.ConnectStripeUserResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
      connectCode: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`connectStripeUser - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId, connectCode } = params.value;

    let connectResponse;
    try {
      connectResponse = await requestHttp({
        uri: 'https://connect.stripe.com/oauth/token',
        method: 'POST',
        body: {
          client_secret: STRIPE_SECRET_KEY,
          code: connectCode,
          grant_type: 'authorization_code',
        },
        json: true,
      });

      // response.status = pb.StatusCode.OK;
    } catch (e) {
      this.logger.error(`connectStripeUser - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    // Check for error in Stripe response
    if (!connectResponse?.stripe_user_id) {
      const errorMsg = connectResponse.error_description || connectResponse.error || 'Failed to connect Stripe account.';
      this.logger.error(`connectStripeUser - error: ${errorMsg}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: errorMsg,
      })];
      span.setTag('error', true);
      span.log({ errors: errorMsg });
      span.finish();
      return response;
    }

    // Only update organization if Stripe connection is valid
    const updateRequest = pb.UpdateOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
      organization: {
        stripeId: connectResponse?.stripe_user_id,
      },
    });

    let updateResponse: pb.UpdatePromoterProfileResponse;
    try {
      updateResponse = await this.proxy.organizationService.updateOrganization(updateRequest);

      if (updateResponse.status !== pb.StatusCode.OK) {
        response.status = updateResponse.status;
        response.errors = updateResponse.errors;
        span.finish();
        return response;
      }

    } catch (e) {
      this.logger.error(`connectStripeUser - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    response.status = pb.StatusCode.OK;
    span.finish();
    return response;
  }

  public retrieveStripeConnectAccount = async (request: pb.RetrieveStripeConnectAccountRequest): Promise<pb.RetrieveStripeConnectAccountResponse> => {
    const span = tracer.startSpan('retrieveStripeConnectAccount', request.spanContext);
    const response: pb.RetrieveStripeConnectAccountResponse = pb.RetrieveStripeConnectAccountResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      stripeAccountId: Joi.string().required(),
    });

    const params = schema.validate(request);
    if (params.error) {
      this.logger.error(`retrieveStripeConnectAccount - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { stripeAccountId } = params.value;


    try {
      const account = await stripe.accounts.retrieve(stripeAccountId);
      response.status = pb.StatusCode.OK;
      response.stripeConnectAccount = this.toPbStripeConnectAccount(account);
    } catch (e) {
      this.logger.error(`retrieveStripeConnectAccount - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public retrieveStripeCharge = async (request: pb.RetrieveStripeChargeRequest): Promise<pb.RetrieveStripeChargeResponse> => {
    const span = tracer.startSpan('retrieveStripeCharge', request.spanContext);
    const response: pb.RetrieveStripeChargeResponse = pb.RetrieveStripeChargeResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
      stripeChargeId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`retrieveStripeCharge - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId, stripeChargeId } = params.value;

    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(`retrieveStripeCharge - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    try {
      const charge = await stripe.charges.retrieve(stripeChargeId, {
        stripeAccount: organization.stripeId,
      });

      const { payment_method_details } = charge as any;
      const { card: { brand, last4 } } = payment_method_details;
      response.status = pb.StatusCode.OK;
      response.stripeCharge = pb.StripeCharge.fromObject({
        brand,
        last4,
      });
    } catch (e) {
      this.logger.error(`retrieveStripeCharge - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public retrieveStripeChargeByIntent = async (request: pb.RetrieveStripeChargeByIntentsRequest): Promise<pb.RetrieveStripeChargeByIntentsResponse> => {
    const span = tracer.startSpan('retrieveStripeChargeByIntents', request.spanContext);
    const response: pb.RetrieveStripeChargeByIntentsResponse = pb.RetrieveStripeChargeByIntentsResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
      stripeIntentId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`retrieveStripeChargeByIntent - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId, stripeIntentId } = params.value;


    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(`retrieveStripeChargeByIntent - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    try {
      const charge = await stripe.paymentIntents.retrieve(stripeIntentId, {
        stripeAccount: organization.stripeId,
      });
      response.status = pb.StatusCode.OK;
      response.stripeChargeId = charge.charges && charge.charges.data ? charge.charges.data[0].id : null
    } catch (e) {
      this.logger.error(`retrieveStripeChargeByIntent - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }
  /****************************************************************************************
    Charges
  ****************************************************************************************/

  public createStripeCharge = async (request: pb.CreateStripeChargeRequest): Promise<pb.CreateStripeChargeResponse> => {
    const span = tracer.startSpan('createStripeCharge', request.spanContext);
    const response: pb.CreateStripeChargeResponse = pb.CreateStripeChargeResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
      userId: Joi.string().required(),
      amount: Joi.number().required(),
      transferAmount: Joi.number().required(),
      feeAmount: Joi.number().required(),
      description: Joi.string().required(),
      stripeToken: Joi.string().required(),
      currency: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(` ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId, userId, amount, feeAmount, description, stripeToken, currency } = params.value;


    /**
     * Find the user profile to get the stripeCustomerId
     */
    const findUserProfileRequest = pb.FindUserProfileRequest.create({
      spanContext: span.context().toString(),
      userId,
    });

    let findUserProfileResponse: pb.FindUserProfileResponse;

    try {
      findUserProfileResponse = await this.proxy.userProfileService.findUserProfile(findUserProfileRequest);
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    let { userProfile: { stripeCustomerId } } = findUserProfileResponse;


    if (!stripeCustomerId) {
      const createStripeCustomerRequest = pb.CreateStripeCustomerRequest.create({
        spanContext: span.context().toString(),
        userId,
        stripeToken,
      });

      let createStripeCustomerResponse: pb.CreateStripeCustomerResponse;

      try {
        createStripeCustomerResponse = await this.createStripeCustomer(createStripeCustomerRequest);
      } catch (e) {
        this.logger.error(` ${e.message}`);
        response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
        response.errors = [
          pb.Error.create({
            key: 'Error',
            message: e.message,
          }),
        ];
        span.setTag('error', true);
        span.log({ errors: e.message });
        span.finish();
        return response;
      }

      stripeCustomerId = createStripeCustomerResponse.stripeCustomerId;
    }

    /**
     * Find the organization
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    /**
    * Mock stripe call and return mock 
    * data if load testing is enabled
    */
    if (LOAD_TEST_ENABLED) {
      response.status = pb.StatusCode.OK;
      response.stripeChargeId = 'MOCK_STRIPE_ID';
      await wait(1000);
      return response;
    }

    /**
    * Because all customers live on the Platform Account
    * but we want to create the charges on the Connected Account,
    * we must create an extra token that temporarily represents the
    * customers card on the connected account,
    * then create the charge using this token
    * https://stripe.com/docs/connect/shared-customers
    */
    try {
      const { id: tokenId } = await stripe.tokens.create({
        customer: stripeCustomerId,
        card: stripeToken,
      }, {
        stripeAccount: organization.stripeId,
      });

      const charge = await stripe.charges.create({
        amount,
        description,
        currency,
        source: tokenId,
        application_fee_amount: feeAmount,
      }, {
        stripeAccount: organization.stripeId,
      });

      const { id } = charge;

      response.status = pb.StatusCode.OK;
      response.stripeChargeId = id;
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public refundStripeCharge = async (request: pb.RefundStripeChargeRequest): Promise<pb.RefundStripeChargeResponse> => {
    const span = tracer.startSpan('refundStripeCharge', request.spanContext);
    const response: pb.RefundStripeChargeResponse = pb.RefundStripeChargeResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
      stripeChargeId: Joi.string().required(),
      amount: Joi.number().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`refundStripeCharge - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId, stripeChargeId, amount } = params.value;


    /** Find the organization **/
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    try {
      await stripe.refunds.create({
        charge: stripeChargeId,
        amount,
      }, {
        stripeAccount: organization.stripeId,
      });
      span.setTag('error', true);
      response.status = pb.StatusCode.OK;
    } catch (e) {

      this.logger.error(`refundStripeCharge - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  /****************************************************************************************
    Customers
  ****************************************************************************************/

  public createStripeCustomer = async (request: pb.CreateStripeCustomerRequest): Promise<pb.CreateStripeCustomerResponse> => {
    const span = tracer.startSpan('createStripeCustomer', request.spanContext);
    const response: pb.CreateStripeCustomerResponse = pb.CreateStripeCustomerResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`createStripeCustomer - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { userId }: { userId: string } = params.value;

    const findUserRequest = pb.FindUserByIdRequest.create({
      spanContext: span.context().toString(),
      userId,
    });

    let findUserResponse: pb.FindUserResponse;

    try {
      findUserResponse = await this.proxy.userService.findUserById(findUserRequest);

      if (!findUserResponse || !findUserResponse.user) {
        throw new Error('Could not find user to create Stripe customer.');
      }
    } catch (e) {
      this.logger.error(`createStripeCustomer - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { user: { firstName, lastName, email, phoneNumber } } = findUserResponse;

    let stripeCustomerId;

    try {
      const stripeCustomer = await stripe.customers.create({
        email: email || undefined,
        name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        phone: phoneNumber,
      });
      const { id } = stripeCustomer;

      stripeCustomerId = id;

      response.status = pb.StatusCode.OK;
      response.stripeCustomer = this.toPbStripeCustomer(stripeCustomer);
    } catch (e) {
      this.logger.error(`createStripeCustomer - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const updateUserProfileRequest = pb.UpdateUserProfileRequest.create({
      spanContext: span.context().toString(),
      userId,
      userProfile: {
        stripeCustomerId,
      },
    });

    try {
      await this.proxy.userProfileService.updateUserProfile(updateUserProfileRequest);
    } catch (e) {
      this.logger.error(`createStripeCustomer - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public retrieveStripeCustomer = async (request: pb.RetrieveStripeCustomerRequest): Promise<pb.RetrieveStripeCustomerResponse> => {
    const span = tracer.startSpan('retrieveStripeCustomer', request.spanContext);
    const response: pb.RetrieveStripeCustomerResponse = pb.RetrieveStripeCustomerResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      stripeCustomerId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`retrieveStripeCustomer - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { stripeCustomerId } = params.value;

    try {
      const customer = await stripe.customers.retrieve(stripeCustomerId) as any;
      const paymentMethods = await stripe.paymentMethods.list({
        customer: stripeCustomerId,
        type: 'card',
      });

      for (const payment of paymentMethods.data) {
        if (payment.billing_details.name === ' ' || payment.billing_details.name === null || payment.billing_details.name === undefined) {
          await stripe.paymentMethods.update(
            payment.id,
            { billing_details: { name: customer.name }, }
          );
        }
      }

      response.status = pb.StatusCode.OK;
      response.stripeCustomer = this.toPbStripeCustomer(customer, paymentMethods.data);
    } catch (e) {
      this.logger.error(`retrieveStripeCustomer - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public updateStripeCustomer = async (request: pb.UpdateStripeCustomerRequest): Promise<pb.UpdateStripeCustomerResponse> => {
    const span = tracer.startSpan('updateStripeCustomer', request.spanContext);
    const response: pb.UpdateStripeCustomerResponse = pb.UpdateStripeCustomerResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      stripeCustomerId: Joi.string().required(),
      userId: Joi.string().required()
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`updateStripeCustomer - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { stripeCustomerId, userId } = params.value;

    const findUserRequest = pb.FindUserByIdRequest.create({
      spanContext: span.context().toString(),
      userId,
    });

    let findUserResponse: pb.FindUserResponse;

    try {
      findUserResponse = await this.proxy.userService.findUserById(findUserRequest);

      if (!findUserResponse || !findUserResponse.user) {
        throw new Error('Could not find user to create Stripe customer.');
      }
    } catch (e) {
      this.logger.error(`createStripeCustomer - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { user: { firstName, lastName, email } } = findUserResponse;

    try {
      const customer = await stripe.customers.update(stripeCustomerId, {
        email: email || undefined,
        name: firstName && lastName ? `${firstName} ${lastName}` : undefined
      });
      response.status = pb.StatusCode.OK;
      response.stripeCustomer = this.toPbStripeCustomer(customer);
    } catch (e) {
      this.logger.error(`updateStripeCustomer - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }
  // DELETE
  public createStripeSource = async (request: pb.CreateStripeSourceRequest): Promise<pb.CreateStripeSourceResponse> => {
    const span = tracer.startSpan('createStripeSource', request.spanContext);
    const response: pb.CreateStripeSourceResponse = pb.CreateStripeSourceResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
      stripeToken: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`createStripeSource - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }

    const { userId, stripeToken } = params.value;

    // Validate ZIP code
    try {
      const token = await stripe.tokens.retrieve(stripeToken);
      const zipCheck = token.card?.address_zip_check;

      if (zipCheck === 'fail') { // if validation fails return error
        const message = 'Card verification failed. Please check and try again.';
        this.logger.warn(`createStripeSource - card zip check failed for user`);
        response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
        response.errors = [
          pb.Error.create({
            key: 'cardVerification',
            message,
          }),
        ];
        span.finish();
        return response;
      }
    } catch (e) {
      this.logger.error(`createStripeSource - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }
    /**
     * Find the user profile to get the stripeCustomerId
     */
    const findUserProfileRequest = pb.FindUserProfileRequest.create({
      spanContext: span.context().toString(),
      userId,
    });

    let findUserProfileResponse: pb.FindUserProfileResponse;

    try {
      findUserProfileResponse = await this.proxy.userProfileService.findUserProfile(findUserProfileRequest);

    } catch (e) {
      this.logger.error(`createStripeSource - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { userProfile: { stripeCustomerId } } = findUserProfileResponse;

    if (!stripeCustomerId) {
      const createStripeCustomerRequest = pb.CreateStripeCustomerRequest.create({
        spanContext: span.context().toString(),
        userId,
        stripeToken,
      });

      let createStripeCustomerResponse: pb.CreateStripeCustomerResponse;

      try {
        createStripeCustomerResponse = await this.createStripeCustomer(createStripeCustomerRequest);

        if (!createStripeCustomerResponse || !createStripeCustomerResponse.stripeCustomer) {
          throw new Error('There was an error creating the Stripe customer account.');
        }

      } catch (e) {
        this.logger.error(`createStripeSource - error: ${e.message}`);
        response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
        response.errors = [
          pb.Error.create({
            key: 'Error',
            message: e.message,
          }),
        ];
        span.setTag('error', true);
        span.log({ errors: e.message });
        span.finish();
        return response;
      }

      response.stripeCustomer = createStripeCustomerResponse.stripeCustomer;
      response.status = pb.StatusCode.OK;

    } else {
      try {
        const { id: sourceId } = await stripe.customers.createSource(stripeCustomerId, {
          source: stripeToken,
        });
        const stripeCustomer = await stripe.customers.update(stripeCustomerId, {
          default_source: sourceId,
        });
        response.stripeCustomer = this.toPbStripeCustomer(stripeCustomer);
        response.status = pb.StatusCode.OK;
      } catch (e) {
        this.logger.error(`createStripeSource - error: ${e.message}`);
        response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
        response.errors = [pb.Error.create({
          key: 'Error',
          message: e.message,
        })];
        span.setTag('error', true);
        span.log({ errors: e.message });
        span.finish();
        return response;
      }
    }

    span.finish();
    return response;
  }

  // DELETE
  public deleteStripeSource = async (request: pb.DeleteStripeSourceRequest): Promise<pb.DeleteStripeSourceResponse> => {
    const span = tracer.startSpan('deleteStripeSource', request.spanContext);
    const response: pb.DeleteStripeSourceResponse = pb.DeleteStripeSourceResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
      sourceId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`deleteStripeSource - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }

    const { userId, sourceId } = params.value;

    const findUserProfileRequest = pb.FindUserProfileRequest.create({
      spanContext: span.context().toString(),
      userId,
    });

    let findUserProfileResponse: pb.FindUserProfileResponse;

    try {
      findUserProfileResponse = await this.proxy.userProfileService.findUserProfile(findUserProfileRequest);

    } catch (e) {
      this.logger.error(`deleteStripeSource - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { userProfile: { stripeCustomerId } } = findUserProfileResponse;

    /**
     * Delete the source in Stripe
     */
    try {
      await stripe.customers.deleteSource(stripeCustomerId, sourceId);
      response.status = pb.StatusCode.OK;
    } catch (e) {
      this.logger.error(`deleteStripeSource - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public createStripeSetupIntent = async (request: pb.CreateStripeSetupIntentRequest): Promise<pb.CreateStripeSetupIntentResponse> => {
    const span = tracer.startSpan('createStripeSetupIntent', request.spanContext);
    const response: pb.CreateStripeSetupIntentResponse = pb.CreateStripeSetupIntentResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`createStripeSetupIntent - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }

    /**
     * Create the SetupIntent
     */
    try {
      const { client_secret: clientSecret } = await stripe.setupIntents.create();
      response.status = pb.StatusCode.OK;
      response.clientSecret = clientSecret;
    } catch (e) {
      this.logger.error(`createStripeSetupIntent - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public getStripeCardByMethod = async (request: pb.GetStripeCardByMethodRequest): Promise<pb.GetStripeCardByMethodResponse> => {
    const span = tracer.startSpan('GetStripeCardByMethod', request.spanContext);
    const response: pb.GetStripeCardByMethodResponse = pb.GetStripeCardByMethodResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      paymentMethodId: Joi.string().required(),
    });

    const params = schema.validate(request);
    if (params.error) {
      this.logger.error(`GetStripeCardByMethod - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }

    /**
     * Get the StripeCard By MethodId
     */
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        params.value.paymentMethodId
      );

      // 🔍 Check if the postal code verification passed
      const postalCodeVerification = paymentMethod.card?.checks?.address_postal_code_check;

      if (postalCodeVerification === 'fail') {
        const message = 'Card postal code verification failed. Please update your billing details.';
        this.logger.warn(`GetStripeCardByMethod - card postal code check failed for user`);
        response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
        response.errors = [
          pb.Error.create({
            key: 'cardVerification',
            message,
          }),
        ];
        span.finish();
        return response;
      }

      response.status = pb.StatusCode.OK;
      if (paymentMethod.card && paymentMethod.card.brand) {
        response.card = {
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year,
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          funding: paymentMethod.card.funding,
          country: paymentMethod.card.country,
          paymentMethodId: params.value.paymentMethodId,
          type: 'card'
        };
      }
    } catch (e) {
      this.logger.error(`GetStripeCardByMethod - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public attachStripePaymentMethod = async (request: pb.AttachStripePaymentMethodRequest): Promise<pb.AttachStripePaymentMethodResponse> => {
    const span = tracer.startSpan('attachStripePaymentMethod', request.spanContext);
    const response: pb.AttachStripePaymentMethodResponse = pb.AttachStripePaymentMethodResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
      paymentMethodId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`attachStripePaymentMethod - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { userId, paymentMethodId } = params.value;


    // 🔍 Retrieve the PaymentMethod
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Check if the postal code is valid or not
    const postalCodeVerfication = paymentMethod.card?.checks?.address_postal_code_check;

    if (postalCodeVerfication === 'fail') {
      const message = 'Card verification failed. Please check and try again.';
        this.logger.warn(`attachStripePaymentMethod - card postal code check failed for user`);
        response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
        response.errors = [
          pb.Error.create({
            key: 'cardVerification',
            message,
          }),
        ];
        span.finish();
        return response;
      }

    /**
    * Find the user profile to get the stripeCustomerId
    */
    const findUserProfileRequest = pb.FindUserProfileRequest.create({
      spanContext: span.context().toString(),
      userId,
    });

    let findUserProfileResponse: pb.FindUserProfileResponse;

    try {
      findUserProfileResponse = await this.proxy.userProfileService.findUserProfile(findUserProfileRequest);
    } catch (e) {
      this.logger.error(`attachStripePaymentMethod - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { userProfile: { stripeCustomerId } } = findUserProfileResponse;

    /**
     * Attach the PaymentMethod to customer
     */
    try {
      const attachResponse = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: stripeCustomerId
      });
      response.status = pb.StatusCode.OK;
      response.paymentMethod = this.toPbStripePaymentMethod(attachResponse);
    } catch (e) {
      this.logger.error(`attachStripePaymentMethod - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public registerStripeTerminalReader = async (request: pb.RegisterStripeTerminalReaderRequest): Promise<pb.RegisterStripeTerminalReaderResponse> => {
    const span = tracer.startSpan('registerStripeTerminalReader', request.spanContext);
    const response: pb.RegisterStripeTerminalReaderResponse = pb.RegisterStripeTerminalReaderResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
      orgId: Joi.string().required(),
      label: Joi.string().required(),
      registrationCode: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`registerStripeTerminalReader - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId, label, registrationCode } = params.value;


    /** 
     * Find the organization 
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(`registerStripeTerminalReader - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    if (!organization.address.address1) {
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: "Before adding a card reader, please enter the Physical Address on the Organization Settings screen.",
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: "Before adding a card reader, please enter the Physical Address on the Organization Settings screen." });
      span.finish();
      return response;
    }

    const location = await stripe.terminal.locations.create({
      display_name: organization.orgName,
      address: {
        "city": organization.address.city,
        "country": organization.address.country,
        "line1": organization.address.address1,
        "postal_code": organization.address.zip,
        "state": organization.address.state
      }
    },
      {
        stripeAccount: organization.stripeId,
      }
    );
    /**
     * Register the reader
     */
    try {
      stripe.terminal.connectionTokens.create({
        location: location.id
      })
      const reader = await stripe.terminal.readers.create({
        label: label,
        registration_code: registrationCode,
        location: location.id,
      }, {
        stripeAccount: organization.stripeId,
      }
      );
      response.status = pb.StatusCode.OK;
      response.reader = this.toPbStripeTerminalReader(reader);
    } catch (e) {
      console.log(e)
      this.logger.error(`registerStripeTerminalReader - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.success = false;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public listStripeTerminalReaders = async (request: pb.ListStripeTerminalReadersRequest): Promise<pb.ListStripeTerminalReadersResponse> => {
    const span = tracer.startSpan('listStripeTerminalReaders', request.spanContext);
    const response: pb.ListStripeTerminalReadersResponse = pb.ListStripeTerminalReadersResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
      orgId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`listStripeTerminalReaders - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId } = params.value;

    /** 
     * Find the organization 
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(`listStripeTerminalReaders - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;


    /**
     * List the readers
     */
    try {
      const { data } = await stripe.terminal.readers.list({}, {
        stripeAccount: organization.stripeId,
      });
      response.status = pb.StatusCode.OK;
      response.readers = data.map(reader => this.toPbStripeTerminalReader(reader));
    } catch (e) {
      this.logger.error(`listStripeTerminalReaders - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.success = false;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public deleteStripeTerminalReader = async (request: pb.DeleteStripeTerminalReaderRequest): Promise<pb.DeleteStripeTerminalReaderResponse> => {
    const span = tracer.startSpan('deleteStripeTerminalReader', request.spanContext);
    const response: pb.DeleteStripeTerminalReaderResponse = pb.DeleteStripeTerminalReaderResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
      orgId: Joi.string().required(),
      readerId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`deleteStripeTerminalReader - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }

    const { orgId, readerId } = params.value;

    /** 
     * Find the organization 
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(`deleteStripeTerminalReader - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    /**
     * List the readers
     */
    try {
      const { deleted } = await stripe.terminal.readers.del(readerId, {
        stripeAccount: organization.stripeId,
      });
      response.status = pb.StatusCode.OK;
      response.success = deleted;
    } catch (e) {
      this.logger.error(`deleteStripeTerminalReader - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.success = false;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public createStripeTerminalConnectionToken = async (request: pb.CreateStripeTerminalConnectionTokenRequest): Promise<pb.CreateStripeTerminalConnectionTokenResponse> => {
    const span = tracer.startSpan('createStripeTerminalConnectionToken', request.spanContext);
    const response: pb.CreateStripeTerminalConnectionTokenResponse = pb.CreateStripeTerminalConnectionTokenResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
      orgId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`createStripeTerminalConnectionToken - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId } = params.value;

    /** 
     * Find the organization 
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(`deleteStripeTerminalReader - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    /**
     * Create the Connection Token
     */
    try {
      const { secret: connectionToken } = await stripe.terminal.connectionTokens.create({}, {
        stripeAccount: organization.stripeId,
      });
      response.status = pb.StatusCode.OK;
      response.connectionToken = connectionToken;
    } catch (e) {
      this.logger.error(`createStripeTerminalConnectionToken - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public createStripeLocationId = async (request: pb.CreateStripeTerminalConnectionTokenRequest): Promise<pb.CreateStripeLocationIdResponse> => {
    const span = tracer.startSpan('createStripeLocationId', request.spanContext);
    const response: pb.CreateStripeLocationIdResponse = pb.CreateStripeLocationIdResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      userId: Joi.string().required(),
      orgId: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(`createStripeLocationId - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId } = params.value;

    /** 
     * Find the organization 
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(`createStripeLocationId - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    /**
     * Create the Connection Token
     */
    try {
      let locationId = organization?.locationId;
      // Sanitize "false" string or boolean to null
      if (locationId === "false" || locationId === false) {
        locationId = null;
      }

      if (!locationId) {
        if (!organization.address.address1 || !organization.address.city || !organization.address.country || !organization.address.zip || !organization.address.state) {
          response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
          response.errors = [
            pb.Error.create({
              key: 'Error',
              message: "Before adding a card reader, please enter the Physical Address on the Organization Settings screen.",
            }),
          ];
          span.setTag('error', true);
          span.log({ errors: "createStripeLocationId - Before adding a card reader, please enter the Physical Address on the Organization Settings screen." });
          span.finish();
          return response;
        }

        const location = await stripe.terminal.locations.create({
          display_name: organization.orgName,
          address: {
            "city": organization.address.city,
            "country": organization.address.country,
            "line1": organization.address.address1,
            "postal_code": organization.address.zip,
            "state": organization.address.state
          }
        },
          {
            stripeAccount: organization.stripeId,
          }
        );
        const updateRequest = pb.UpdateOrganizationRequest.create({
          spanContext: span.context().toString(),
          orgId,
          organization: {
            locationId: location.id
          },
        });
        let updateResponse: pb.UpdatePromoterProfileResponse;
        try {

          updateResponse = await this.proxy.organizationService.updateOrganization(updateRequest);

          if (updateResponse.status !== pb.StatusCode.OK) {
            response.status = updateResponse.status;
            response.errors = updateResponse.errors;
            span.finish();
            return response;
          }

        } catch (e) {
          this.logger.error(`createStripeLocationId - error: ${e.message}`);
          response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
          response.errors = [pb.Error.create({
            key: 'Error',
            message: e.message,
          })];
          span.setTag('error', true);
          span.log({ errors: e.message });
          span.finish();
          return response;
        }
        locationId = location?.id;
      }
      response.status = pb.StatusCode.OK;
      response.locationId = locationId;
    } catch (e) {
      this.logger.error(`createStripeLocationId - error: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public createStripePaymentIntent = async (request: pb.CreateStripePaymentIntentRequest): Promise<pb.CreateStripePaymentIntentResponse> => {
    const span = tracer.startSpan('createStripePaymentIntent 0', request.spanContext);
    const response: pb.CreateStripePaymentIntentResponse = pb.CreateStripePaymentIntentResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
      userId: Joi.string().optional().allow(''),
      amount: Joi.number().required(),
      transferAmount: Joi.number().required(),
      feeAmount: Joi.number().required(),
      description: Joi.string().required(),
      currency: Joi.string().required(),
      paymentMethodId: Joi.string().optional().allow(''),
    });

    const params = schema.validate(request);
    if (params.error) {
      this.logger.error(` ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const {
      orgId,
      userId,
      amount,
      feeAmount,
      description,
      currency,
      paymentMethodId
    } = params.value;

    /**
     * Find the organization
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;


    if (LOAD_TEST_ENABLED) {
      response.status = pb.StatusCode.OK;
      response.stripeChargeId = 'MOCK_STRIPE_ID';
      await wait(1000);
      return response;
    }

    let clonedPaymentMethodId: string | undefined = undefined;

    if (paymentMethodId) {
      /**
      * Find the user profile to get the stripeCustomerId
      */
      const findUserProfileRequest = pb.FindUserProfileRequest.create({
        spanContext: span.context().toString(),
        userId,
      });

      let findUserProfileResponse: pb.FindUserProfileResponse;

      try {
        findUserProfileResponse = await this.proxy.userProfileService.findUserProfile(findUserProfileRequest);
      } catch (e) {
        this.logger.error(` ${e.message}`);
        response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
        response.errors = [
          pb.Error.create({
            key: 'Error',
            message: e.message,
          }),
        ];
        span.setTag('error', true);
        span.log({ errors: e.message });
        span.finish();
        return response;
      }

      let { userProfile: { stripeCustomerId } } = findUserProfileResponse;

      try {
        const { id } = await stripe.paymentMethods.create({
          customer: stripeCustomerId,
          payment_method: paymentMethodId,
        }, {
          stripeAccount: organization.stripeId,
        });
        clonedPaymentMethodId = id;
      } catch (e) {
        this.logger.error(` ${e.message}`);
        response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
        response.errors = [
          pb.Error.create({
            key: 'Error',
            message: e.message,
          }),
        ];
        span.setTag('error', true);
        span.log({ errors: e.message });
        span.finish();
        return response;
      }
    }


    /**
      * Find the user profile to get the stripeCustomerId
      */
    const findUserProfileRequest = pb.FindUserProfileRequest.create({
      spanContext: span.context().toString(),
      userId,
    });

    let findUserProfileResponse: pb.FindUserProfileResponse;

    try {
      findUserProfileResponse = await this.proxy.userProfileService.findUserProfile(findUserProfileRequest);
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    let { userProfile: { stripeCustomerId } } = findUserProfileResponse;

    try {
      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: stripeCustomerId },
        { apiVersion: '2020-08-27' }
      );

      const { id, client_secret } = await stripe.paymentIntents.create({
        amount: amount,
        description: description,
        currency: currency,
        application_fee_amount: feeAmount,
        payment_method_types: ['card', 'card_present'],
        capture_method: 'manual',
        payment_method: clonedPaymentMethodId,
      }, {
        stripeAccount: organization.stripeId,
      });

      response.status = pb.StatusCode.OK;
      response.paymentIntentId = id;
      response.clientSecret = client_secret;
      response.ephemeralKey = ephemeralKey.id
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    span.finish();
    return response;
  }

  public captureStripePaymentIntent = async (request: pb.CaptureStripePaymentIntentRequest): Promise<pb.CaptureStripePaymentIntentResponse> => {
    const span = tracer.startSpan('captureStripePaymentIntent 0', request.spanContext);
    const response: pb.CaptureStripePaymentIntentResponse = pb.CaptureStripePaymentIntentResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
      paymentIntentId: Joi.string().required(),
    });
    const params = schema.validate(request);

    if (params.error) {
      this.logger.error(` ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const {
      orgId,
      paymentIntentId,
    } = params.value;

    /**
     * Find the organization
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;
    let capture;
    let billingAddress;
    try {
      capture = await stripe.paymentIntents.capture(paymentIntentId, {
        stripeAccount: organization.stripeId,
      });

      if (capture.status !== 'succeeded') {
        throw new Error(`Failed to capture paymentIntent ${paymentIntentId}`)
      }

      const charge = capture?.charges?.data[0];
      const address = charge?.billing_details?.address;

      billingAddress = {
        line1: address?.line1 || '',
        line2: address?.line2 || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postal_code || '',
        country: address?.country || '',
      };

    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }
    response.chargeId = capture.charges.data[0].id;
    response.status = pb.StatusCode.OK;
    response.billingAddress = billingAddress;
    span.finish();
    return response;
  }

  public cancelStripePaymentIntent = async (request: pb.CancelStripePaymentIntentRequest): Promise<pb.CancelStripePaymentIntentResponse> => {
    const span = tracer.startSpan('cancelStripePaymentIntent 0', request.spanContext);
    const response: pb.CancelStripePaymentIntentResponse = pb.CancelStripePaymentIntentResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
      paymentIntentId: Joi.string().required(),
    });

    const params = schema.validate(request);


    if (params.error) {
      this.logger.error(` ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const {
      orgId,
      paymentIntentId,
    } = params.value;
    /**
     * Find the organization
     */
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [
        pb.Error.create({
          key: 'Error',
          message: e.message,
        }),
      ];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    const { organization } = findOrgResponse;

    try {
      const { status } = await stripe.paymentIntents.cancel(paymentIntentId, {
        stripeAccount: organization.stripeId,
      });

      if (status !== 'canceled') {
        throw new Error(`Failed to cancel paymentIntent ${paymentIntentId}`)
      }

    } catch (e) {
      this.logger.error(` ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({
        key: 'Error',
        message: e.message,
      })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    response.status = pb.StatusCode.OK;
    span.finish();
    return response;
  }

  public stripePublishKey = async (request: pb.RetrieveStripeChargeRequest): Promise<pb.StripePublishKeyByResponse> => {

    return {
      publicStripeKey: STRIPE_PUBLISHABLE_KEY
    }

  }

  public resetStripeConnection = async (request: pb.ResetStripeConnectionRequest): Promise<pb.ResetStripeConnectionResponse> => {
    const span = tracer.startSpan('resetStripeConnection', request.spanContext);
    const response: pb.ResetStripeConnectionResponse = pb.ResetStripeConnectionResponse.create();

    const schema = Joi.object().keys({
      spanContext: Joi.string().required(),
      orgId: Joi.string().required(),
    });
    const params = schema.validate(request);
    if (params.error) {
      this.logger.error(`resetStripeConnection - error: ${JSON.stringify(params.error)}`);
      response.status = pb.StatusCode.UNPROCESSABLE_ENTITY;
      response.errors = joiToErrors(params.error, pb.Error);
      span.setTag('error', true);
      span.log({ errors: params.error });
      span.finish();
      return response;
    }
    const { orgId } = params.value;

    // 1. Find the organization to get the current stripeId
    const findOrgRequest = pb.FindOrganizationRequest.create({
      spanContext: span.context().toString(),
      orgId,
    });
    let findOrgResponse = pb.FindOrganizationResponse;
    try {
      findOrgResponse = await this.proxy.organizationService.findOrganization(findOrgRequest);
    } catch (e) {
      this.logger.error(`resetStripeConnection - error finding org: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({ key: 'Error', message: e.message })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }
    const { organization } = findOrgResponse;
    if (!organization ) {
      response.status = pb.StatusCode.NOT_FOUND;
      response.errors = [pb.Error.create({ key: 'Error', message: 'Error while retrieving organization details.' })];
      span.setTag('error', true);
      span.log({ errors: 'Error while retrieving organization details.' });
      span.finish();
      return response;
    }

    // 2. Delete the connected Stripe account
    if (organization?.stripeId) {
      try {
        await stripe.accounts.del(organization.stripeId);
      } catch (e) {
        this.logger.error(`resetStripeConnection - error deleting Stripe account: ${e.message}`);
      }
    }

    // 3. Remove the stripeId from the organization
    const removeOrgStripeIdRequest = pb.RemoveOrganizationStripeIdRequest.create({
      spanContext: span.context().toString(),
      orgId
    });
    try {
      const removeOrgStripeIdResponse = await this.proxy.organizationService.removeOrganizationStripeId(removeOrgStripeIdRequest);
      if (removeOrgStripeIdResponse.status !== pb.StatusCode.OK) {
        response.status = removeOrgStripeIdResponse.status;
        response.errors = removeOrgStripeIdResponse.errors;
        span.finish();
        return response;
      }
    } catch (e) {
      this.logger.error(`resetStripeConnection - error updating org: ${e.message}`);
      response.status = pb.StatusCode.INTERNAL_SERVER_ERROR;
      response.errors = [pb.Error.create({ key: 'Error', message: e.message })];
      span.setTag('error', true);
      span.log({ errors: e.message });
      span.finish();
      return response;
    }

    response.status = pb.StatusCode.OK;
    span.finish();
    return response;
  }
}
