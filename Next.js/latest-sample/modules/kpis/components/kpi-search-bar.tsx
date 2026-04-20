'use client';

import { Search, Filter } from 'lucide-react';

interface KPISearchBarProps {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
}

export function KPISearchBar({ onSearch, onFilter }: KPISearchBarProps) {
  return (
    <div className="relative group">
      <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B6C1]"
                aria-hidden="true"
              />
              <input
                data-slot="input"
                className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#B0B6C1]"
                placeholder="Search KPIs..."
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
            <button
              data-slot="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 border-white/10 text-white hover:bg-white/5"
              onClick={onFilter}
            >
              <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
              Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
