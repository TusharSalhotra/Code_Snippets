/**
 * SearchBar Component (Shared)
 * Reusable search bar using shadcn/ui Input with optional Filter/Export actions and debounced change.
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Filter as FilterIcon, Download as DownloadIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void; // fires on each keystroke
  onSearch?: (query: string) => void; // debounced callback by default
  onDebouncedChange?: (value: string) => void; // alias for onSearch
  placeholder?: string;
  debounceMs?: number;
  onFilter?: () => void;
  onExport?: () => void;
  className?: string;
  inputClassName?: string;
  actionsClassName?: string;
}

export function SearchBar({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  onDebouncedChange,
  placeholder = 'Search…',
  debounceMs = 250,
  onFilter,
  onExport,
  className,
  inputClassName,
  actionsClassName,
}: SearchBarProps) {
  const [internal, setInternal] = useState<string>(value ?? defaultValue);
  const debouncedHandler = useMemo(() => onSearch ?? onDebouncedChange, [onSearch, onDebouncedChange]);

  // Keep internal state in sync when controlled
  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  // Debounce notifying parent for onSearch/onDebouncedChange
  useEffect(() => {
    if (!debouncedHandler) return;
    const id = setTimeout(() => debouncedHandler(internal), Math.max(0, debounceMs));
    return () => clearTimeout(id);
  }, [internal, debounceMs, debouncedHandler]);

  const handleChange = (v: string) => {
    if (value === undefined) setInternal(v); // uncontrolled
    onChange?.(v);
    if (!debouncedHandler && onSearch) onSearch(v); // fallback immediate if no debounce desired
  };

  return (
    <div className={cn('relative group', className)}>
      <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        <div className={cn('flex flex-col lg:flex-row gap-4 items-stretch')}> 
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B6C1]" aria-hidden="true" />
            <Input
              value={internal}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className={cn(
                'pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#B0B6C1] h-9',
                inputClassName
              )}
            />
          </div>

          {(onFilter || onExport) && (
            <div className={cn('flex gap-2', actionsClassName)}>
              {onFilter && (
                <button
                  type="button"
                  onClick={onFilter}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 border-white/10 text-white hover:bg-white/5"
                >
                  <FilterIcon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              )}
              {onExport && (
                <button
                  type="button"
                  onClick={onExport}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 border-white/10 text-white hover:bg-white/5"
                >
                  <DownloadIcon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
