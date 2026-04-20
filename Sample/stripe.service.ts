import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';
import { ILoginUserData } from '../interface';
import { RpcException } from '@nestjs/microservices';
import { StatusCodeEnum } from '../enums';
import { ErrorMessages } from '../enums/ErrorMessages';
import { Common } from '../enums/Common';

// Custom error codes for Stripe credential/resource issues
export const STRIPE_CREDENTIAL_ERROR_CODES = {
  CUSTOMER_NOT_FOUND: 'STRIPE_CUSTOMER_NOT_FOUND',
  PAYMENT_METHOD_NOT_FOUND: 'STRIPE_PAYMENT_METHOD_NOT_FOUND',
  SUBSCRIPTION_NOT_FOUND: 'STRIPE_SUBSCRIPTION_NOT_FOUND',
  CONNECT_ACCOUNT_NOT_FOUND: 'STRIPE_CONNECT_ACCOUNT_NOT_FOUND',
  RESOURCE_NOT_FOUND: 'STRIPE_RESOURCE_NOT_FOUND',
} as const;

@Injectable()
export class StripeService {
  // Keep the actual instance private (original name preserved)
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16' as any,
  });

  // Non-breaking accessor method to retrieve the Stripe SDK instance
  getClient(): Stripe {
    return this.stripe;
  }

  // ==========================================
  // STRIPE RESOURCE VALIDATION HELPERS
  // ==========================================

  /**
   * Check if a Stripe error indicates a missing resource
   * This typically happens when Stripe credentials have changed
   */
  isResourceMissingError(error: any): boolean {
    return (
      error?.code === 'resource_missing' ||
      error?.type === 'StripeInvalidRequestError' &&
      (error?.message?.includes('No such customer') ||
        error?.message?.includes('No such payment_method') ||
        error?.message?.includes('No such PaymentMethod') ||
        error?.message?.includes('No such subscription') ||
        error?.message?.includes('No such account') ||
        error?.message?.includes('No such price') ||
        error?.message?.includes('No such product'))
    );
  }

  /**
   * Determine the type of missing resource from an error
   */
  getResourceMissingType(error: any): string | null {
    if (!this.isResourceMissingError(error)) return null;

    const message = error?.message || '';
    if (message.includes('customer')) return STRIPE_CREDENTIAL_ERROR_CODES.CUSTOMER_NOT_FOUND;
    if (message.includes('payment_method') || message.includes('PaymentMethod'))
      return STRIPE_CREDENTIAL_ERROR_CODES.PAYMENT_METHOD_NOT_FOUND;
    if (message.includes('subscription')) return STRIPE_CREDENTIAL_ERROR_CODES.SUBSCRIPTION_NOT_FOUND;
    if (message.includes('account')) return STRIPE_CREDENTIAL_ERROR_CODES.CONNECT_ACCOUNT_NOT_FOUND;
    return STRIPE_CREDENTIAL_ERROR_CODES.RESOURCE_NOT_FOUND;
  }

  /**
   * Verify if a Stripe customer exists
   * Returns null if customer doesn't exist (indicating credential change or deletion)
   */
  async verifyCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      if ((customer as any).deleted) {
        return null;
      }
      return customer as Stripe.Customer;
    } catch (error: any) {
      if (this.isResourceMissingError(error)) {
        console.warn(`[StripeService] Customer ${customerId} not found - may indicate credential change`);
        return null;
      }
      throw error;
    }
  }

  /**
   * Verify if a payment method exists and is usable
   * Returns null if payment method doesn't exist
   */
  async verifyPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod | null> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
      return paymentMethod;
    } catch (error: any) {
      if (this.isResourceMissingError(error)) {
        console.warn(`[StripeService] Payment method ${paymentMethodId} not found - may indicate credential change`);
        return null;
      }
      throw error;
    }
  }

  /**
   * Verify if a Connect account exists and is valid
   * Returns null if account doesn't exist
   */
  async verifyConnectAccount(accountId: string): Promise<Stripe.Account | null> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);
      return account;
    } catch (error: any) {
      if (this.isResourceMissingError(error)) {
        console.warn(`[StripeService] Connect account ${accountId} not found - may indicate credential change`);
        return null;
      }
      throw error;
    }
  }

  /**
   * Create a user-friendly error for credential-related issues
   */
  createCredentialChangeError(resourceType: string): RpcException {
    const messages: Record<string, string> = {
      [STRIPE_CREDENTIAL_ERROR_CODES.CUSTOMER_NOT_FOUND]:
        'Your payment profile needs to be updated. Please add a new payment method.',
      [STRIPE_CREDENTIAL_ERROR_CODES.PAYMENT_METHOD_NOT_FOUND]:
        'Your saved payment method is no longer valid. Please add a new payment method.',
      [STRIPE_CREDENTIAL_ERROR_CODES.SUBSCRIPTION_NOT_FOUND]:
        'Your subscription information needs to be updated. Please contact support.',
      [STRIPE_CREDENTIAL_ERROR_CODES.CONNECT_ACCOUNT_NOT_FOUND]:
        'Your payout account needs to be reconnected. Please complete the onboarding process again.',
      [STRIPE_CREDENTIAL_ERROR_CODES.RESOURCE_NOT_FOUND]:
        'Payment information needs to be updated. Please try again with new payment details.',
    };

    return new RpcException({
      statusCode: StatusCodeEnum.BAD_REQUEST,
      code: resourceType,
      message: messages[resourceType] || messages[STRIPE_CREDENTIAL_ERROR_CODES.RESOURCE_NOT_FOUND],
      requiresPaymentMethodUpdate: true,
    });
  }

  /**
   * Safe attach payment method with validation
   * Returns the attached payment method or throws a user-friendly error
   */
  async safeAttachPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<Stripe.PaymentMethod> {
    // First verify the payment method exists
    const paymentMethod = await this.verifyPaymentMethod(paymentMethodId);
    if (!paymentMethod) {
      throw this.createCredentialChangeError(STRIPE_CREDENTIAL_ERROR_CODES.PAYMENT_METHOD_NOT_FOUND);
    }

    // Check if already attached to a customer
    if (paymentMethod.customer) {
      if (paymentMethod.customer === customerId) {
        // Already attached to this customer
        return paymentMethod;
      }
      // Attached to a different customer - this is a different issue
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: 'This payment method is already associated with another account.',
      });
    }

    // Attach to customer
    try {
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set as default
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      return paymentMethod;
    } catch (error: any) {
      if (this.isResourceMissingError(error)) {
        const resourceType = this.getResourceMissingType(error);
        throw this.createCredentialChangeError(resourceType || STRIPE_CREDENTIAL_ERROR_CODES.RESOURCE_NOT_FOUND);
      }
      throw error;
    }
  }

  /**
   * Ensure customer exists, creating if necessary
   * Handles the case where stored customer ID is invalid
   */
  async ensureCustomer(
    existingCustomerId: string | undefined,
    email: string,
    name: string,
  ): Promise<{ customerId: string; wasCreated: boolean }> {
    // If we have an existing customer ID, verify it
    if (existingCustomerId) {
      const customer = await this.verifyCustomer(existingCustomerId);
      if (customer) {
        return { customerId: customer.id, wasCreated: false };
      }
      console.warn(`[StripeService] Existing customer ${existingCustomerId} not found, creating new one`);
    }

    // Create new customer
    const newCustomer = await this.stripe.customers.create({
      email,
      name,
      metadata: {
        platform: 'HWH',
        createdDueToCredentialChange: existingCustomerId ? 'true' : 'false',
      },
    });

    return { customerId: newCustomer.id, wasCreated: true };
  }

  getEventFromWebhookPayload(signature: string, payload: Buffer) {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'undefined'
    );
  }
 


  async chargeCustomer(
    loginUser: ILoginUserData,
    amount: number,
    currency: string,
    sourceToken: string,
    description: string,
  ) {
    try {
  const token = await this.stripe.tokens.retrieve(sourceToken);
      if (!token || !token.card) {
        throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.INVALID_TOKEN_PROVIDED);
      }

      const { firstName, lastName, email, stripeCustomerId } = loginUser;
      let customerId = stripeCustomerId;

      if (!customerId) {
        // If no customer exists, create new one
  const customer = await this.stripe.customers.create({
          name: token.card.name || `${firstName} ${lastName}`,
          email,
          // source: sourceToken,
        });

        customerId = customer.id;
      }

      // Step 2: Create a payment method from the token
  const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: sourceToken },
        billing_details: {
          name: `${firstName} ${lastName}`,
          email,
        },
      });

      // Step 3: Attach payment method to customer
  await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });

      // Step 4: Set default payment method (optional but recommended)
  await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });

      // Step 5: Create a PaymentIntent using the PaymentMethod
  const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method: paymentMethod.id,
        description,
        confirm: true,
        // confirmation_method: 'automatic',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });
      return {
        status: 'succeeded',
        paymentIntentData: paymentIntent,
      };
    } catch (error: any) {
      if (error.type === 'StripeCardError' || error.raw?.code) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: error.raw?.code || error.code,
          message: error.message || 'Payment failed due to card error.',
        });
      }
      if (error.raw?.code) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: error.raw.code,
          message: error.raw.message,
        });
      }
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: ErrorMessages[Common.DEFAULT_LANG]?.PAYMENT_FAILED_TRY_AGAIN,
      });
    }
  }


  async attachPaymentMethodToCustomer(
    customerId: string,
    paymentMethodId: string,
  ) {
    try {
      // Verify payment method exists first
      const paymentMethod = await this.verifyPaymentMethod(paymentMethodId);
      if (!paymentMethod) {
        throw this.createCredentialChangeError(STRIPE_CREDENTIAL_ERROR_CODES.PAYMENT_METHOD_NOT_FOUND);
      }

      // Verify customer exists
      const customer = await this.verifyCustomer(customerId);
      if (!customer) {
        throw this.createCredentialChangeError(STRIPE_CREDENTIAL_ERROR_CODES.CUSTOMER_NOT_FOUND);
      }

      // Check if already attached to this customer
      if (paymentMethod.customer === customerId) {
        // Already attached to this customer, just ensure it's set as default
        await this.stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
        return true;
      }

      // If attached to a different customer, detach first then reattach
      if (paymentMethod.customer) {
        console.log(`[STRIPE] Payment method ${paymentMethodId} is attached to customer ${paymentMethod.customer}, detaching before reattaching to ${customerId}`);
        await this.stripe.paymentMethods.detach(paymentMethodId);
      }

      // Attach PM
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      // Set as default
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      return true;
    } catch (error: any) {
      // Handle race condition: payment method already attached to another customer
      if (error.type === 'StripeInvalidRequestError' &&
          error.message?.includes('already been attached')) {
        console.log(`[STRIPE] Race condition: Payment method ${paymentMethodId} already attached, detaching and retrying`);
        try {
          // Re-fetch the payment method to get current state
          const currentPM = await this.stripe.paymentMethods.retrieve(paymentMethodId);

          if (currentPM.customer === customerId) {
            // Already attached to our customer — just set as default
            await this.stripe.customers.update(customerId, {
              invoice_settings: { default_payment_method: paymentMethodId },
            });
            return true;
          }

          // Attached to a different customer — detach then reattach
          if (currentPM.customer) {
            await this.stripe.paymentMethods.detach(paymentMethodId);
          }
          await this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
          await this.stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
          });
          return true;
        } catch (retryError: any) {
          console.error(`[STRIPE] Failed to reattach payment method after detach:`, retryError.message);
          throw retryError;
        }
      }
      if (this.isResourceMissingError(error)) {
        const resourceType = this.getResourceMissingType(error);
        throw this.createCredentialChangeError(resourceType || STRIPE_CREDENTIAL_ERROR_CODES.RESOURCE_NOT_FOUND);
      }
      throw error;
    }
  }


async createSubscription(
  customerId: string,
  priceId: string,
  couponId?: string,
  transferData?: {
    coachConnectAccountId: string;
    applicationFeePercent: number; // Platform's share percentage (100 - coachPercentage)
  },
) {
  const subscriptionData: any = {
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
  };

  // Add coupon if provided
  if (couponId) {
    subscriptionData.coupon = couponId;
  }

  // Add transfer_data for coach affiliate split (destination charge)
  // This makes the transfer visible on the payment page in Stripe Dashboard
  if (transferData?.coachConnectAccountId) {
    subscriptionData.transfer_data = {
      destination: transferData.coachConnectAccountId,
    };
    // Application fee is the platform's share (what HWH keeps)
    subscriptionData.application_fee_percent = transferData.applicationFeePercent;
    console.log('[StripeService] Creating subscription with destination charge:', {
      destination: transferData.coachConnectAccountId,
      applicationFeePercent: transferData.applicationFeePercent,
    });
  }

  return this.stripe.subscriptions.create(subscriptionData);
}

// Create a Stripe coupon
async createStripeCoupon(
  couponCode: string,
  discountType: 'percentage' | 'amount',
  discountValue: number,
  currency?: string,
): Promise<Stripe.Coupon> {
  const couponData: Stripe.CouponCreateParams = {
    id: couponCode.toLowerCase().replace(/\s+/g, '_'), // Stripe coupon ID format
    name: couponCode,
  };

  if (discountType === 'percentage') {
    couponData.percent_off = discountValue;
  } else {
    // For fixed amount discounts, currency is required
    if (!currency) {
      throw new Error(ErrorMessages[Common.DEFAULT_LANG]?.CURRENCY_REQUIRED_FOR_FIXED_AMOUNT);
    }
    couponData.amount_off = Math.round(discountValue * 100); // Convert to cents
    couponData.currency = currency.toLowerCase();
  }

  return this.stripe.coupons.create(couponData);
}

// Get or create Stripe coupon
async getOrCreateStripeCoupon(
  couponCode: string,
  discountType: 'percentage' | 'amount',
  discountValue: number,
  currency?: string,
): Promise<string> {
  const stripeCouponId = couponCode.toLowerCase().replace(/\s+/g, '_');
  
  try {
    // Try to retrieve existing coupon
    await this.stripe.coupons.retrieve(stripeCouponId);
    return stripeCouponId;
  } catch (error: any) {
    if (error.code === 'resource_missing') {
      // Coupon doesn't exist, create it
      const coupon = await this.createStripeCoupon(couponCode, discountType, discountValue, currency);
      return coupon.id;
    }
    throw error;
  }
}


async hasActiveSubscriptionForSamePlan(
  customerId: string,
  priceId: string,
): Promise<boolean> {
  const subscriptions = await this.stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    expand: ['data.items.data.price'],
    limit: 100,
  });

  return subscriptions.data.some(sub => {
    // consider only subscriptions that still matter
    const validStatus = [
      'active',
      'trialing',
      'past_due',
      'incomplete',
      'incomplete_expired',
    ].includes(sub.status);

    if (!validStatus) return false;

    // check if SAME PRICE exists
    return sub.items.data.some(
      item => item.price?.id === priceId,
    );
  });
}

  // Upgrade subscription with prorated billing
  async upgradeSubscription(
    stripeSubscriptionId: string,
    newPriceId: string,
    couponId?: string,
  ) {
    const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
    
    const updateData: any = {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations', // This enables prorated billing
      expand: ['latest_invoice.payment_intent'],
    };

    // Add coupon if provided
    if (couponId) {
      updateData.coupon = couponId;
    }

    return this.stripe.subscriptions.update(stripeSubscriptionId, updateData);
  }

  // Calculate prorated amount for upgrade preview
  async calculateUpgradeProration(
    stripeSubscriptionId: string,
    newPriceId: string,
  ) {
    try {
      console.log('Stripe calculateUpgradeProration called');
      console.log('stripeSubscriptionId:', stripeSubscriptionId);
      console.log('newPriceId:', newPriceId);

      const subscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);
      console.log('Retrieved Stripe subscription:', {
        id: subscription.id,
        status: subscription.status,
        current_period_start: (subscription as any).current_period_start,
        current_period_end: (subscription as any).current_period_end,
        items_count: subscription.items.data.length
      });
      
      // For accurate prorated calculation, we'll calculate it manually
      const currentPrice = subscription.items.data[0].price;
      console.log('Current price:', {
        id: currentPrice?.id,
        unit_amount: currentPrice?.unit_amount,
        currency: currentPrice?.currency
      });

      const newPrice = await this.stripe.prices.retrieve(newPriceId);
      console.log(' New price:', {
        id: newPrice?.id,
        unit_amount: newPrice?.unit_amount,
        currency: newPrice?.currency
      });
      
      const currentPeriodEnd = (subscription as any).current_period_end;
      const currentPeriodStart = (subscription as any).current_period_start;
      const now = Math.floor(Date.now() / 1000);
      const remainingTime = currentPeriodEnd - now;
      const totalPeriod = currentPeriodEnd - currentPeriodStart;
      const usedTime = now - currentPeriodStart;
      
      console.log('Time calculations:', {
        now,
        currentPeriodStart,
        currentPeriodEnd,
        remainingTime,
        totalPeriod,
        remainingDays: Math.ceil(remainingTime / (24 * 60 * 60))
      });
      
      // Calculate prorated amounts
      const unusedAmount = (currentPrice?.unit_amount || 0) * (remainingTime / totalPeriod) / 100;
      const newPlanAmount = (newPrice?.unit_amount || 0) / 100;
      const proratedAmount = Math.max(0, newPlanAmount - unusedAmount);

      const result = {
        totalAmount: newPlanAmount,
        proratedAmount,
        unusedAmount,
        remainingDays: Math.ceil(remainingTime / (24 * 60 * 60)),
      };

      console.log('Calculated proration result:', result);
      return result;
      
    } catch (error) {
      console.error('Error in calculateUpgradeProration:', error);
      throw error;
    }
  }

  // ==========================================
  // STRIPE CONNECT METHODS
  // ==========================================

  /**
   * Create a Stripe Connect Express account for a coach
   * This enables coaches to receive payouts from appointment payments
   */
  async createConnectAccount(
    email: string,
    firstName: string,
    lastName: string,
    country: string = 'US',
  ): Promise<Stripe.Account> {
    try {
      console.log('=== Stripe Connect Debug ===');
      console.log('Creating Connect account for:', email);
      console.log('Using Stripe key prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...');

      const account = await this.stripe.accounts.create({
        type: 'express',
        country,
        email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
          first_name: firstName,
          last_name: lastName,
          email,
        },
        metadata: {
          platform: 'HWH',
          role: 'coach',
        },
      });

      console.log('Connect account created successfully:', account.id);
      return account;
    } catch (error: any) {
      console.error('=== Stripe Connect Error ===');
      console.error('Error type:', error.type);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));

      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to create Stripe Connect account',
      });
    }
  }

  /**
   * Generate an onboarding link for the coach to complete their Stripe Connect setup
   */
  async createConnectOnboardingLink(
    accountId: string,
    refreshUrl: string,
    returnUrl: string,
  ): Promise<Stripe.AccountLink> {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink;
    } catch (error: any) {
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to create onboarding link',
      });
    }
  }

  /**
   * Check if a Connect account has completed onboarding and can receive payments
   */
  async getConnectAccountStatus(accountId: string): Promise<{
    isOnboarded: boolean;
    payoutsEnabled: boolean;
    chargesEnabled: boolean;
    detailsSubmitted: boolean;
    accountNotFound?: boolean;
  }> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);

      return {
        isOnboarded: account.details_submitted && account.charges_enabled,
        payoutsEnabled: account.payouts_enabled || false,
        chargesEnabled: account.charges_enabled || false,
        detailsSubmitted: account.details_submitted || false,
      };
    } catch (error: any) {
      // Handle missing Connect account (credential change scenario)
      if (this.isResourceMissingError(error)) {
        console.warn(`[StripeService] Connect account ${accountId} not found - may indicate credential change`);
        return {
          isOnboarded: false,
          payoutsEnabled: false,
          chargesEnabled: false,
          detailsSubmitted: false,
          accountNotFound: true,
        };
      }
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to retrieve Connect account status',
      });
    }
  }

  /**
   * Create a login link for coach to access their Stripe Express dashboard
   */
  async createConnectLoginLink(accountId: string): Promise<Stripe.LoginLink> {
    try {
      return await this.stripe.accounts.createLoginLink(accountId);
    } catch (error: any) {
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to create dashboard login link',
      });
    }
  }

  /**
   * Create a destination charge that automatically splits payment between HWH and coach
   *
   * @param loginUser - The customer making the payment
   * @param amount - Total amount in base currency units (e.g., cents for USD)
   * @param currency - Currency code (e.g., 'usd', 'eur')
   * @param sourceToken - Stripe card token
   * @param description - Payment description
   * @param coachConnectAccountId - Coach's Stripe Connect account ID
   * @param coachSharePercentage - Percentage of payment that goes to coach (e.g., 100 for 100%)
   *
   * @example
   * // Appointment price = $100 (10000 cents)
   * // Coach share = 100%, Platform share = 0%
   * // Coach receives: $100, HWH receives: $0
   */
  async chargeWithDestination(
    loginUser: ILoginUserData,
    amount: number,
    currency: string,
    sourceToken: string,
    description: string,
    coachConnectAccountId: string,
    coachSharePercentage: number,
  ): Promise<{
    status: string;
    paymentIntentData: Stripe.PaymentIntent;
    coachShareAmount: number;
    platformShareAmount: number;
    transferId?: string;
  }> {
    try {
      // Verify coach's Connect account exists before processing payment
      const connectAccount = await this.verifyConnectAccount(coachConnectAccountId);
      if (!connectAccount) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: STRIPE_CREDENTIAL_ERROR_CODES.CONNECT_ACCOUNT_NOT_FOUND,
          message: 'The coach\'s payment account is not available. Please contact the coach to complete their payment setup.',
          requiresCoachOnboarding: true,
        });
      }

      const token = await this.stripe.tokens.retrieve(sourceToken);
      if (!token || !token.card) {
        throw new Error('Invalid token provided');
      }

      const { firstName, lastName, email, stripeCustomerId } = loginUser;

      // Use ensureCustomer to handle invalid customer IDs
      const { customerId } = await this.ensureCustomer(
        stripeCustomerId,
        email,
        `${firstName} ${lastName}`,
      );

      // Create payment method from token
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: sourceToken },
        billing_details: {
          name: `${firstName} ${lastName}`,
          email,
        },
      });

      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerId,
      });

      // Set default payment method
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });

      // Calculate the split
      // Coach share amount (what they receive)
      const coachShareAmount = Math.round((amount * coachSharePercentage) / 100);
      // Platform keeps the rest
      const platformShareAmount = amount - coachShareAmount;

      // Create PaymentIntent with destination charge
      // The full amount is charged to customer
      // `transfer_data.amount` is what goes to coach
      // The rest automatically stays with HWH (platform)
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method: paymentMethod.id,
        description,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        // Destination charge: money goes to coach's account
        transfer_data: {
          destination: coachConnectAccountId,
          amount: coachShareAmount, // Amount transferred to coach
        },
        metadata: {
          coachSharePercentage: coachSharePercentage.toString(),
          coachShareAmount: coachShareAmount.toString(),
          platformShareAmount: platformShareAmount.toString(),
        },
      });

      // Get transfer ID if available
      const transfer = paymentIntent.transfer_data?.destination
        ? (paymentIntent as any).latest_charge?.transfer
        : undefined;

      return {
        status: 'succeeded',
        paymentIntentData: paymentIntent,
        coachShareAmount,
        platformShareAmount,
        transferId: typeof transfer === 'string' ? transfer : transfer?.id,
      };
    } catch (error: any) {
      // Re-throw RpcExceptions (already formatted)
      if (error instanceof RpcException) {
        throw error;
      }
      // Handle credential/resource missing errors
      if (this.isResourceMissingError(error)) {
        const resourceType = this.getResourceMissingType(error);
        throw this.createCredentialChangeError(resourceType || STRIPE_CREDENTIAL_ERROR_CODES.RESOURCE_NOT_FOUND);
      }
      if (error.type === 'StripeCardError' || error.raw?.code) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: error.raw?.code || error.code,
          message: error.message || 'Payment failed due to card error.',
        });
      }
      if (error.raw?.code) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: error.raw.code,
          message: error.raw.message,
        });
      }
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Payment failed. Please try again.',
      });
    }
  }

  /**
   * Create a destination charge using existing customer and payment method
   * For cases where payment method is already saved
   */
  async chargeExistingCustomerWithDestination(
    customerId: string,
    paymentMethodId: string,
    amount: number,
    currency: string,
    description: string,
    coachConnectAccountId: string,
    coachSharePercentage: number,
  ): Promise<{
    status: string;
    paymentIntentData: Stripe.PaymentIntent;
    coachShareAmount: number;
    platformShareAmount: number;
  }> {
    try {
      // Verify all resources exist before processing
      const [customer, paymentMethod, connectAccount] = await Promise.all([
        this.verifyCustomer(customerId),
        this.verifyPaymentMethod(paymentMethodId),
        this.verifyConnectAccount(coachConnectAccountId),
      ]);

      if (!customer) {
        throw this.createCredentialChangeError(STRIPE_CREDENTIAL_ERROR_CODES.CUSTOMER_NOT_FOUND);
      }
      if (!paymentMethod) {
        throw this.createCredentialChangeError(STRIPE_CREDENTIAL_ERROR_CODES.PAYMENT_METHOD_NOT_FOUND);
      }
      if (!connectAccount) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: STRIPE_CREDENTIAL_ERROR_CODES.CONNECT_ACCOUNT_NOT_FOUND,
          message: 'The coach\'s payment account is not available. Please contact the coach to complete their payment setup.',
          requiresCoachOnboarding: true,
        });
      }

      const coachShareAmount = Math.round((amount * coachSharePercentage) / 100);
      const platformShareAmount = amount - coachShareAmount;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method: paymentMethodId,
        description,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        transfer_data: {
          destination: coachConnectAccountId,
          amount: coachShareAmount,
        },
        metadata: {
          coachSharePercentage: coachSharePercentage.toString(),
          coachShareAmount: coachShareAmount.toString(),
          platformShareAmount: platformShareAmount.toString(),
        },
      });

      return {
        status: 'succeeded',
        paymentIntentData: paymentIntent,
        coachShareAmount,
        platformShareAmount,
      };
    } catch (error: any) {
      // Re-throw RpcExceptions (already formatted)
      if (error instanceof RpcException) {
        throw error;
      }
      // Handle credential/resource missing errors
      if (this.isResourceMissingError(error)) {
        const resourceType = this.getResourceMissingType(error);
        throw this.createCredentialChangeError(resourceType || STRIPE_CREDENTIAL_ERROR_CODES.RESOURCE_NOT_FOUND);
      }
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Payment failed. Please try again.',
      });
    }
  }

  // ==========================================
  // STRIPE TRANSFERS (for package-based appointments)
  // ==========================================

  /**
   * Create a transfer to a coach's Connect account
   * Used for package-based appointments where payment was already made at package purchase time
   *
   * @param coachConnectAccountId - Coach's Stripe Connect account ID
   * @param amount - Amount to transfer in smallest currency unit (e.g., cents)
   * @param currency - Currency code (e.g., 'eur', 'usd')
   * @param description - Description for the transfer
   * @param metadata - Optional metadata for tracking
   * @param sourceTransaction - Optional charge ID to link the transfer to (allows transfer before funds settle)
   */
  async createTransferToCoach(
    coachConnectAccountId: string,
    amount: number,
    currency: string,
    description: string,
    metadata?: Record<string, string>,
    sourceTransaction?: string,
  ): Promise<{
    success: boolean;
    transferId: string;
    amount: number;
    currency: string;
  }> {
    try {
      // Verify Connect account exists
      const connectAccount = await this.verifyConnectAccount(coachConnectAccountId);
      if (!connectAccount) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: STRIPE_CREDENTIAL_ERROR_CODES.CONNECT_ACCOUNT_NOT_FOUND,
          message: 'Coach\'s payment account is not available for transfer.',
          requiresCoachOnboarding: true,
        });
      }

      // Check if account can receive transfers
      if (!connectAccount.charges_enabled || !connectAccount.payouts_enabled) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: 'Coach\'s payment account is not fully set up to receive payments.',
          requiresCoachOnboarding: true,
        });
      }

      // Create the transfer
      // If sourceTransaction is provided, the transfer is linked to that charge
      // This allows transfer even before funds settle
      const transferData: any = {
        amount,
        currency: currency.toLowerCase(),
        destination: coachConnectAccountId,
        description,
        metadata: {
          platform: 'HWH',
          type: 'subscription_affiliate_share',
          ...metadata,
        },
      };

      // Link to source transaction if provided (allows transfer from pending balance)
      if (sourceTransaction) {
        transferData.source_transaction = sourceTransaction;
        console.log(`[StripeService] Using source_transaction: ${sourceTransaction}`);
      }

      const transfer = await this.stripe.transfers.create(transferData);

      console.log(`[StripeService] Transfer created: ${transfer.id} - ${amount} ${currency} to ${coachConnectAccountId}`);

      return {
        success: true,
        transferId: transfer.id,
        amount: transfer.amount,
        currency: transfer.currency,
      };
    } catch (error: any) {
      // Re-throw RpcExceptions
      if (error instanceof RpcException) {
        throw error;
      }

      // Handle insufficient funds error
      if (error.code === 'balance_insufficient') {
        console.error(`[StripeService] Insufficient balance for transfer to ${coachConnectAccountId}`);
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: 'Unable to process coach payment at this time. Please contact support.',
          code: 'INSUFFICIENT_PLATFORM_BALANCE',
        });
      }

      // Handle Connect account errors
      if (this.isResourceMissingError(error)) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: STRIPE_CREDENTIAL_ERROR_CODES.CONNECT_ACCOUNT_NOT_FOUND,
          message: 'Coach\'s payment account is not available.',
          requiresCoachOnboarding: true,
        });
      }

      console.error(`[StripeService] Transfer failed:`, error.message);
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to transfer payment to coach.',
      });
    }
  }

  /**
   * Calculate and create transfer for a package-based appointment
   *
   * @param packagePrice - Original price of the package
   * @param totalAppointmentsInPackage - Total appointments included in the package
   * @param coachConnectAccountId - Coach's Stripe Connect account ID
   * @param coachSharePercentage - Percentage of payment that goes to coach
   * @param currency - Currency code
   * @param appointmentId - Appointment ID for tracking
   * @param purchasedPackageId - Purchased package ID for tracking
   */
  async transferCoachShareForPackageAppointment(
    packagePrice: number,
    totalAppointmentsInPackage: number,
    coachConnectAccountId: string,
    coachSharePercentage: number,
    currency: string,
    appointmentId: string,
    purchasedPackageId: string,
  ): Promise<{
    success: boolean;
    transferId: string;
    perAppointmentValue: number;
    coachShareAmount: number;
    platformShareAmount: number;
  }> {
    // Calculate per-appointment value
    const perAppointmentValue = packagePrice / totalAppointmentsInPackage;

    // Calculate coach share (in cents/smallest currency unit)
    const perAppointmentValueInCents = Math.round(perAppointmentValue * 100);
    const coachShareAmount = Math.round((perAppointmentValueInCents * coachSharePercentage) / 100);
    const platformShareAmount = perAppointmentValueInCents - coachShareAmount;

    console.log(`[StripeService] Package appointment transfer calculation:`, {
      packagePrice,
      totalAppointmentsInPackage,
      perAppointmentValue,
      perAppointmentValueInCents,
      coachSharePercentage,
      coachShareAmount,
      platformShareAmount,
    });

    // Only transfer if coach share is greater than 0
    if (coachShareAmount <= 0) {
      console.log(`[StripeService] Coach share is 0, skipping transfer`);
      return {
        success: true,
        transferId: '',
        perAppointmentValue,
        coachShareAmount: 0,
        platformShareAmount: perAppointmentValueInCents,
      };
    }

    const transfer = await this.createTransferToCoach(
      coachConnectAccountId,
      coachShareAmount,
      currency,
      `Coach share for package-based appointment ${appointmentId}`,
      {
        appointmentId,
        purchasedPackageId,
        perAppointmentValue: perAppointmentValue.toString(),
        coachSharePercentage: coachSharePercentage.toString(),
      },
    );

    return {
      success: transfer.success,
      transferId: transfer.transferId,
      perAppointmentValue,
      coachShareAmount: coachShareAmount / 100, // Convert back to base currency
      platformShareAmount: platformShareAmount / 100,
    };
  }

  // ==========================================
  // RECEIPTS & INVOICES
  // ==========================================

  /**
   * Get receipt URL for a payment intent
   * @param paymentIntentId - Stripe Payment Intent ID
   */
  async getPaymentReceipt(paymentIntentId: string): Promise<{
    receiptUrl: string | null;
    paymentIntent: any;
  }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['latest_charge'],
      });

      const charge = paymentIntent.latest_charge as any;
      const receiptUrl = charge?.receipt_url || null;

      return {
        receiptUrl,
        paymentIntent: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          description: paymentIntent.description,
          created: new Date(paymentIntent.created * 1000),
        },
      };
    } catch (error: any) {
      console.error(`[StripeService] Failed to get receipt: ${error.message}`);
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to get payment receipt',
      });
    }
  }

  /**
   * Get receipt URL for a charge
   * @param chargeId - Stripe Charge ID
   */
  async getChargeReceipt(chargeId: string): Promise<{
    receiptUrl: string | null;
    charge: any;
  }> {
    try {
      const charge = await this.stripe.charges.retrieve(chargeId);

      return {
        receiptUrl: charge.receipt_url || null,
        charge: {
          id: charge.id,
          amount: charge.amount / 100,
          currency: charge.currency,
          status: charge.status,
          description: charge.description,
          receiptEmail: charge.receipt_email,
          created: new Date(charge.created * 1000),
        },
      };
    } catch (error: any) {
      console.error(`[StripeService] Failed to get charge receipt: ${error.message}`);
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to get charge receipt',
      });
    }
  }

  /**
   * Send receipt email to customer
   * @param chargeId - Stripe Charge ID
   * @param email - Email to send receipt to (optional, uses charge's receipt_email if not provided)
   */
  async sendReceiptEmail(chargeId: string, email?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const charge = await this.stripe.charges.retrieve(chargeId);

      if (!charge.receipt_url) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          message: 'No receipt available for this charge',
        });
      }

      // Update charge with receipt email if provided
      if (email) {
        await this.stripe.charges.update(chargeId, {
          receipt_email: email,
        });
      }

      // Note: Stripe automatically sends receipt emails when receipt_email is set
      // If you need to manually trigger, you'd need to use your own email service
      // with the receipt_url

      return {
        success: true,
        message: `Receipt email will be sent to ${email || charge.receipt_email}`,
      };
    } catch (error: any) {
      if (error instanceof RpcException) throw error;
      console.error(`[StripeService] Failed to send receipt email: ${error.message}`);
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to send receipt email',
      });
    }
  }

  /**
   * Get coach's Stripe Express Dashboard login link
   * @param connectAccountId - Coach's Stripe Connect Account ID
   */
  async getCoachDashboardLink(connectAccountId: string): Promise<{
    url: string;
    expiresAt: Date;
  }> {
    try {
      // Verify the account exists
      const account = await this.verifyConnectAccount(connectAccountId);
      if (!account) {
        throw new RpcException({
          statusCode: StatusCodeEnum.BAD_REQUEST,
          code: STRIPE_CREDENTIAL_ERROR_CODES.CONNECT_ACCOUNT_NOT_FOUND,
          message: 'Coach payment account not found',
        });
      }

      // Create login link
      const loginLink = await this.stripe.accounts.createLoginLink(connectAccountId);

      return {
        url: loginLink.url,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Link expires in ~5 minutes
      };
    } catch (error: any) {
      if (error instanceof RpcException) throw error;
      console.error(`[StripeService] Failed to create dashboard link: ${error.message}`);
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to create dashboard link',
      });
    }
  }

  /**
   * Get transfer receipt/details for coach
   * @param transferId - Stripe Transfer ID
   */
  async getTransferDetails(transferId: string): Promise<any> {
    try {
      const transfer = await this.stripe.transfers.retrieve(transferId);

      return {
        id: transfer.id,
        amount: transfer.amount / 100,
        currency: transfer.currency,
        description: transfer.description,
        destination: transfer.destination,
        created: new Date(transfer.created * 1000),
        metadata: transfer.metadata,
      };
    } catch (error: any) {
      console.error(`[StripeService] Failed to get transfer details: ${error.message}`);
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to get transfer details',
      });
    }
  }

  /**
   * List all charges for a customer (for invoice/receipt history)
   * @param customerId - Stripe Customer ID
   * @param limit - Number of charges to return
   */
  async getCustomerCharges(customerId: string, limit: number = 10): Promise<any[]> {
    try {
      const charges = await this.stripe.charges.list({
        customer: customerId,
        limit,
      });

      return charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount / 100,
        currency: charge.currency,
        status: charge.status,
        description: charge.description,
        receiptUrl: charge.receipt_url,
        receiptEmail: charge.receipt_email,
        created: new Date(charge.created * 1000),
        paymentMethod: charge.payment_method_details?.type,
      }));
    } catch (error: any) {
      console.error(`[StripeService] Failed to get customer charges: ${error.message}`);
      throw new RpcException({
        statusCode: StatusCodeEnum.BAD_REQUEST,
        message: error.message || 'Failed to get customer charges',
      });
    }
  }
}


