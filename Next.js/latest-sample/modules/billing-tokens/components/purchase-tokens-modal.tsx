/**
 * Purchase Tokens Modal Component
 */

'use client';

import { useState } from 'react';
import { FormModal } from '@/src/shared/components/FormModal';
import { Button } from '@/components/ui/button';
import { TokenPackageCard } from './token-package-card';
import { TOKEN_PACKAGES } from '../constants/token-packages';

interface PurchaseTokensModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchase: (packageId: string) => void;
}

export function PurchaseTokensModal({
  open,
  onOpenChange,
  onPurchase,
}: PurchaseTokensModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePurchase = () => {
    if (selectedPackage) {
      onPurchase(selectedPackage);
      setSelectedPackage(null);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedPackage(null);
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Purchase Additional Tokens"
      description="Buy extra tokens for this billing period"
      width="xl"
      onCancel={handleCancel}
      hideFooter
    >
      <div className="space-y-3 py-4">
        {TOKEN_PACKAGES.map((pkg) => (
          <TokenPackageCard
            key={pkg.id}
            package={pkg}
            selected={selectedPackage === pkg.id}
            onSelect={() => setSelectedPackage(pkg.id)}
          />
        ))}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="border-white/10 text-white hover:bg-white/5"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handlePurchase}
          disabled={!selectedPackage}
          className="bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90 disabled:opacity-50"
        >
          Purchase
        </Button>
      </div>
    </FormModal>
  );
}
