import { BillingInfo } from '../types';
import { DEFAULT_BILLING } from '../constants';

export async function fetchBillingInfo(): Promise<BillingInfo> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEFAULT_BILLING;
}
