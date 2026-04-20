export interface BillingInfo {
  id: string;
  plan: 'free' | 'pro' | 'enterprise';
  tokens: number;
  tokensUsed: number;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
  amount: number;
}

export interface TokenPackage {
  id: string;
  tokens: number;
  pricePerToken: number;
  totalPrice: number;
  popular?: boolean;
}

export interface PurchaseTokenInput {
  packageId: string;
  tokens: number;
  amount: number;
}
