'use client';

import React from 'react';
import { getCSSVariable, TEXT, BACKGROUND, BORDER } from '@/src/lib/colors';

/**
 * Card Component
 * 
 * Reusable glass-morphism card with consistent styling
 * Found repeated in: organization-setup, roles, reports, security-compliance
 * 
 * @example
 * <Card icon={<Settings />} title="Security" description="Manage security settings">
 *   <Toggle />
 * </Card>
 */

interface CardProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({
  children,
  icon,
  title,
  description,
  action,
  interactive = false,
  onClick,
  className = ''
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border transition-all ${interactive ? 'cursor-pointer hover:border-[color:var(--border-hover)]' : ''} ${className}`}
      style={{
        backgroundColor: BACKGROUND.overlay5,
        borderColor: BORDER.default
      }}
    >
      {/* Header with icon and title */}
      {(icon || title) && (
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            {icon && (
              <div style={{ color: 'var(--primary-cyan)' }} className="mt-1">
                {icon}
              </div>
            )}
            {title && (
              <div>
                <h4 style={{ color: TEXT.primary }} className="font-medium">
                  {title}
                </h4>
                {description && (
                  <p style={{ color: TEXT.secondary }} className="text-sm mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Card content */}
      {children}
    </div>
  );
}
