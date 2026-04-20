'use client';

import { FC, ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  title,
  description,
  action,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
};
