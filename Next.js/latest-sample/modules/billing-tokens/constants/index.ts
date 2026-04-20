import { BillingInfo } from '../types';

export const DEFAULT_BILLING: BillingInfo = {
  id: '1',
  plan: 'pro',
  tokens: 100000,
  tokensUsed: 45230,
  billingCycle: 'monthly',
  nextBillingDate: '2024-12-01T00:00:00Z',
  amount: 99,
};
