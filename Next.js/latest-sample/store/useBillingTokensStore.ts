/**
 * Billing Tokens Zustand Store
 */

import { create } from 'zustand';
import type { BillingInfo } from '@/modules/billing-tokens/types';

interface BillingTokensState {
  billing: BillingInfo | null;
  loading: boolean;
  purchaseTokens: (packageId: string, tokens: number) => void;
  setBilling: (billing: BillingInfo) => void;
}

export const useBillingTokensStore = create<BillingTokensState>((set) => ({
  billing: {
    id: '1',
    plan: 'pro',
    tokens: 100000,
    tokensUsed: 45230,
    billingCycle: 'monthly',
    nextBillingDate: '2025-12-15',
    amount: 99,
  },
  loading: false,
  
  purchaseTokens: (packageId, tokens) =>
    set((state) => ({
      billing: state.billing
        ? {
            ...state.billing,
            tokens: state.billing.tokens + tokens,
          }
        : null,
    })),
    
  setBilling: (billing) => set({ billing }),
}));
