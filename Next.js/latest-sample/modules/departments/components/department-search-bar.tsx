/**
 * DepartmentSearchBar Component
 */

'use client';

import { Search } from 'lucide-react';

interface DepartmentSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function DepartmentSearchBar({ value, onChange }: DepartmentSearchBarProps) {
  return (
    <div className="relative group ">
      <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B0B6C1]" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search departments..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#B0B6C1] flex h-9 min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
