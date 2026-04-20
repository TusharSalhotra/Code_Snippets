'use client';

import { Shield, SquarePen, Trash2, CircleCheck } from 'lucide-react';
import { Role, RoleType } from '../types';

interface RoleCardProps {
  role: Role;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
}

function getRoleTypeBadgeClasses(type: RoleType): string {
  switch (type) {
    case 'system':
      return 'border-[#00AEEF]/30 text-[#00AEEF]';
    case 'custom':
      return 'border-[#00F5C6]/30 text-[#00F5C6]';
    default:
      return 'border-white/10 text-[#B0B6C1]';
  }
}

export function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  return (
    <div className="relative group hover:shadow-lg hover:shadow-[#00F5C6]/10 transition-all">
      <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#00F5C6]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-white mb-1">{role.name}</h3>
              <div className="flex gap-2">
                <span
                  data-slot="badge"
                  className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground ${getRoleTypeBadgeClasses(role.type)}`}
                >
                  {role.type}
                </span>
                <span
                  data-slot="badge"
                  className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground border-white/10 text-[#B0B6C1]"
                >
                  {role.userCount} users
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {role.canEdit && (
              <button
                data-slot="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 rounded-md text-[#B0B6C1] hover:text-white"
                onClick={() => onEdit?.(role)}
              >
                <SquarePen className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {role.canDelete && (
              <button
                data-slot="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent dark:hover:bg-accent/50 size-9 rounded-md text-red-400 hover:text-red-300"
                onClick={() => onDelete?.(role)}
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[#B0B6C1] text-sm mb-4">{role.description}</p>

        {/* Permissions Summary */}
        <div className="space-y-2">
          <p className="text-white text-sm">Permissions Summary:</p>
          <div className="grid grid-cols-2 gap-2">
            {role.permissions.map((permission, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <CircleCheck className="w-3 h-3 text-[#00F5C6]" aria-hidden="true" />
                <span className="text-[#B0B6C1]">{permission.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
