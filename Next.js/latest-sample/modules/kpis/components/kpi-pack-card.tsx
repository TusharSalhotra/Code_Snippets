'use client';

import { KPIPack } from '../types';

interface KPIPackCardProps {
  pack: KPIPack;
  onAddPack?: (pack: KPIPack) => void;
}

export function KPIPackCard({ pack, onAddPack }: KPIPackCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        <div className="p-6">
          <div className="text-3xl mb-3">{pack.emoji}</div>
          <h3 className="text-white mb-2">{pack.name}</h3>
          <p className="text-[#B0B6C1] text-sm mb-4">{pack.description}</p>
          <div className="flex items-center justify-between">
            <span
              data-slot="badge"
              className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground border-[#00F5C6]/50 text-[#00F5C6]"
            >
              {pack.kpiCount} KPIs
            </span>
            <button
              data-slot="button"
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-[#00AEEF] hover:text-[#00AEEF]/80"
              onClick={() => onAddPack?.(pack)}
            >
              Add Pack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
