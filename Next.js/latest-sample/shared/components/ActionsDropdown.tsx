/**
 * ActionsDropdown Component
 * A reusable dropdown menu for common actions (Edit, Delete, View, etc.)
 */

'use client';

import { 
  Edit, 
  Trash2, 
  Eye, 
  EllipsisVertical,
  LucideIcon,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface ActionItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  separator?: boolean; // Add separator before this item
}

interface ActionsDropdownProps {
  actions: ActionItem[];
  triggerIcon?: LucideIcon;
  align?: 'start' | 'end' | 'center';
  triggerClassName?: string;
  contentClassName?: string;
}

export function ActionsDropdown({
  actions,
  triggerIcon: TriggerIcon = MoreVertical,
  align = 'end',
  triggerClassName,
  contentClassName,
}: ActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all size-9 rounded-md text-[#B0B6C1] hover:text-white hover:bg-accent dark:hover:bg-accent/50",
            triggerClassName
          )}
          aria-label="More options"
        >
          <TriggerIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={align} 
        className={cn("w-48", contentClassName)}
      >
        {actions.map((action, index) => (
          <div key={index}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={action.onClick}
              className={cn(
                "cursor-pointer",
                action.variant === 'destructive' && "text-red-400"
              )}
            >
              {action.icon && (
                <action.icon 
                  className={cn(
                    "w-4 h-4 mr-2",
                    action.variant === 'destructive' ? "text-red-400" : "text-[#00F5C6]"
                  )} 
                />
              )}
              <span>{action.label}</span>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Convenience function to create common action items
export const createActions = {
  edit: (onClick: () => void): ActionItem => ({
    label: 'Edit',
    icon: Edit,
    onClick,
  }),
  
  delete: (onClick: () => void): ActionItem => ({
    label: 'Delete',
    icon: Trash2,
    onClick,
    variant: 'destructive',
    separator: true,
  }),
  
  view: (onClick: () => void): ActionItem => ({
    label: 'View Details',
    icon: Eye,
    onClick,
  }),
  
  custom: (
    label: string, 
    onClick: () => void, 
    options?: Partial<Omit<ActionItem, 'label' | 'onClick'>>
  ): ActionItem => ({
    label,
    onClick,
    ...options,
  }),
};
