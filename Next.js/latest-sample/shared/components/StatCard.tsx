'use client';

import React from 'react';
import { TEXT, BACKGROUND, BORDER } from '@/src/lib/colors';

/**
 * StatCard Component
 * 
 * Compact card for displaying statistics/metrics
 * Found repeated in: roles (role-stats), dashboard, reports
 * 
 * @example
 * <StatCard
 *   icon={<Users />}
 *   label="Total Users"
 *   value="1,234"
 *   trend={+12}
 *   trendLabel="vs last month"
 * />
 */

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  color?: string;
}

export function StatCard({ 
  icon, 
  label, 
  value, 
  trend, 
  trendLabel,
  color = 'var(--primary-cyan)'
}: StatCardProps) {
  const isPositive = trend ? trend >= 0 : false;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg border transition-all hover:border-[color:var(--border-hover)]"
      style={{
        backgroundColor: BACKGROUND.overlay5,
        borderColor: BORDER.default
      }}
    >
      {/* Icon Container */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ color, opacity: 0.8 }}
      >
        {icon}
      </div>

      {/* Stats Content */}
      <div className="flex-1">
        <p style={{ color: TEXT.secondary }} className="text-sm mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 style={{ color: TEXT.primary }} className="text-2xl font-bold">
            {value}
          </h3>
          {trend !== undefined && (
            <span
              className="text-xs font-medium"
              style={{
                color: isPositive ? '#10B981' : '#EF4444'
              }}
            >
              {isPositive ? '+' : ''}{trend}% {trendLabel && <span style={{ color: TEXT.secondary }}>{trendLabel}</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
