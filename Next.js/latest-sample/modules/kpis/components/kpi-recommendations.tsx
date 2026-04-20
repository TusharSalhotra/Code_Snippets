'use client';

import { Brain } from 'lucide-react';

interface KPIRecommendationsProps {
  onViewRecommendations?: () => void;
}

export function KPIRecommendations({ onViewRecommendations }: KPIRecommendationsProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-2">AI Recommendations</h3>
              <p className="text-[#B0B6C1] text-sm mb-4">
                Based on your organization structure, we recommend adding 3 KPIs for the Support
                team to improve performance tracking.
              </p>
              <button
                data-slot="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 border-[#00F5C6]/50 text-[#00F5C6] hover:bg-[#00F5C6]/10"
                onClick={onViewRecommendations}
              >
                View Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
