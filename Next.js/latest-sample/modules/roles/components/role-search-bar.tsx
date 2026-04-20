'use client';

import { Search } from 'lucide-react';

interface RoleSearchBarProps {
  onSearch?: (query: string) => void;
}

export function RoleSearchBar({ onSearch }: RoleSearchBarProps) {
  return (
    <div className="relative group">
      <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B6C1]"
            aria-hidden="true"
          />
          <input
            data-slot="input"
            className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#B0B6C1]"
            placeholder="Search roles..."
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
