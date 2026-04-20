/**
 * Token Package Card Component
 */

'use client';

import { Check } from 'lucide-react';
import { TokenPackage } from '../types';

interface TokenPackageCardProps {
  package: TokenPackage;
  selected: boolean;
  onSelect: () => void;
}

export function TokenPackageCard({ package: pkg, selected, onSelect }: TokenPackageCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative group p-4 cursor-pointer rounded-lg transition-all ${
        selected
          ? 'ring-2 ring-[#00F5C6]'
          : 'hover:ring-2 hover:ring-[#00F5C6]/50'
      }`}
    >
      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] px-3 py-1 text-xs font-semibold text-[#0A0F1C]">
            Most Popular
          </span>
        </div>
      )}

      <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white font-semibold text-lg">
                {pkg.tokens.toLocaleString()} tokens
              </p>
              {selected && (
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0A0F1C]" />
                </div>
              )}
            </div>
            <p className="text-[#B0B6C1] text-sm">
              ${pkg.pricePerToken.toFixed(3)} per token
            </p>
          </div>
          <div className="text-right">
            <p className="text-white text-2xl font-bold">
              ${pkg.totalPrice}
            </p>
            <p className="text-[#B0B6C1] text-xs mt-1">
              one-time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
