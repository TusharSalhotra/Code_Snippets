'use client';

import { FC } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number | string;
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
  iconColor: string;
  trend?: 'up' | 'down';
}

export const StatsCard: FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
  trend = 'up',
}) => {
  const isPositive = changeType === 'increase';
  const arrow = isPositive ? '↑' : '↓';
  const changeTextColor = isPositive ? '#00F5C6' : '#d4183d';

  // Format change text
  const changeText = typeof change === 'string' 
    ? change 
    : change !== undefined 
      ? `${arrow} ${Math.round(Math.abs(change))}% from last month`
      : '';

  return (
    <div className="relative group">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      {/* Card */}
      <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#00F5C6]/50 transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[#B0B6C1] text-sm mb-2 truncate">{title}</p>
            <p className="text-white text-3xl mb-1 truncate">{value}</p>
            {changeText && (
              <p className="text-sm text-[#00F5C6]">
                {changeText}
              </p>
            )}
          </div>
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              iconColor || 'bg-gradient-to-br from-[#00F5C6] to-[#00AEEF]'
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

