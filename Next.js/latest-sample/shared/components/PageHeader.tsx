'use client';

import React from 'react';
import { getCSSVariable, TEXT, BACKGROUND, BORDER } from '@/src/lib/colors';

/**
 * PageHeader Component
 * 
 * Reusable header for all pages with title, description, and action buttons
 * Found repeated in: users, dashboard, reports, roles, integrations, organization-setup
 * 
 * @example
 * <PageHeader
 *   title="Users"
 *   description="Manage your organization's users"
 *   actions={[
 *     { label: 'Import CSV', onClick: handleImport },
 *     { label: 'Add User', onClick: handleAdd, primary: true }
 *   ]}
 * />
 */

interface PageAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: PageAction[];
  breadcrumb?: string[];
}

export function PageHeader({ title, description, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
      <div className="flex-1">
        {breadcrumb && (
          <div className="text-sm mb-2" style={{ color: TEXT.secondary }}>
            {breadcrumb.join(' / ')}
          </div>
        )}
        <h1 style={{ color: TEXT.primary }} className="text-3xl font-bold mb-2">
          {title}
        </h1>
        {description && (
          <p style={{ color: TEXT.secondary }}>
            {description}
          </p>
        )}
      </div>

      {actions && actions.length > 0 && (
        <div className="flex gap-3 flex-wrap lg:flex-nowrap">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2"
              style={{
                backgroundColor: action.primary ? 'var(--gradient-primary)' : BACKGROUND.overlay5,
                color: action.primary ? '#0A0F1C' : TEXT.primary,
                border: `1px solid ${action.primary ? 'transparent' : BORDER.default}`
              }}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
