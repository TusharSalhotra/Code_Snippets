/**
 * StatusBadge Component
 * A reusable badge component for displaying status with consistent styling
 */

'use client';

import { cn } from '@/lib/utils';

export type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'draft' 
  | 'archived'
  | 'completed'
  | 'scheduled'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
  variant?: 'default' | 'dot';
}

const statusStyles: Record<string, string> = {
  active: 'border-[#00F5C6]/50 text-[#00F5C6]',
  inactive: 'border-red-400/50 text-red-400',
  pending: 'border-yellow-400/50 text-yellow-400',
  draft: 'border-yellow-400/50 text-yellow-400',
  archived: 'border-gray-400/50 text-gray-400',
  completed: 'border-[#00F5C6]/50 text-[#00F5C6]',
  scheduled: 'border-[#00AEEF]/50 text-[#00AEEF]',
  success: 'border-[#00F5C6]/50 text-[#00F5C6]',
  warning: 'border-yellow-400/50 text-yellow-400',
  error: 'border-red-400/50 text-red-400',
  info: 'border-[#00AEEF]/50 text-[#00AEEF]',
};

const dotStyles: Record<string, string> = {
  active: 'bg-[#00F5C6]',
  inactive: 'bg-red-400',
  pending: 'bg-yellow-400',
  draft: 'bg-yellow-400',
  archived: 'bg-gray-400',
  completed: 'bg-[#00F5C6]',
  scheduled: 'bg-[#00AEEF]',
  success: 'bg-[#00F5C6]',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
  info: 'bg-[#00AEEF]',
};

export function StatusBadge({ 
  status, 
  className,
  variant = 'default' 
}: StatusBadgeProps) {
  const statusLower = status.toLowerCase();
  const baseStyles = statusStyles[statusLower] || 'border-white/10 text-[#B0B6C1]';
  
  if (variant === 'dot') {
    const dotColor = dotStyles[statusLower] || 'bg-white/50';
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("w-2 h-2 rounded-full", dotColor)} />
        <span className="text-sm capitalize">{status}</span>
      </div>
    );
  }

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 capitalize",
        baseStyles,
        className
      )}
    >
      {status}
    </span>
  );
}
