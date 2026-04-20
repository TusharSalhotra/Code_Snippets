/**
 * Billing & Tokens Constants
 */

import { TokenPackage } from '../types';

export const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'pkg-10k',
    tokens: 10000,
    pricePerToken: 0.02,
    totalPrice: 200,
  },
  {
    id: 'pkg-25k',
    tokens: 25000,
    pricePerToken: 0.018,
    totalPrice: 450,
    popular: true,
  },
  {
    id: 'pkg-50k',
    tokens: 50000,
    pricePerToken: 0.015,
    totalPrice: 750,
  },
];
