/**
 * Token Purchase Schema
 */

import { z } from 'zod';

export const purchaseTokenSchema = z.object({
  packageId: z.string().min(1, 'Please select a token package'),
});

export type PurchaseTokenFormData = z.infer<typeof purchaseTokenSchema>;
