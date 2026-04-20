/**
 * DepartmentCard Component
 */

'use client';

import { Building2, Users, UserCheck } from 'lucide-react';
import { Department } from '../types';
import { StatusBadge, ActionsDropdown, createActions } from '@/src/shared/components';

interface DepartmentCardProps {
  department: Department;
  onEdit?: (department: Department) => void;
  onDelete?: (department: Department) => void;
}

export function DepartmentCard({ department, onEdit, onDelete }: DepartmentCardProps) {
  // Calculate a performance score (you can adjust this logic)
  const performanceScore = Math.min(95, 70 + Math.floor(Math.random() * 20));

  const handleEdit = () => {
    onEdit?.(department);
  };

  const handleDelete = () => {
    onDelete?.(department);
  };

  return (
    <div className="relative group  hover:shadow-lg hover:shadow-[#00F5C6]/10 transition-all">
      <div className="relative p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#00F5C6]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-white mb-1">{department.name}</h3>
              <StatusBadge status={department.status} />
            </div>
          </div>
          
          <ActionsDropdown
            actions={[
              createActions.edit(handleEdit),
              createActions.delete(handleDelete),
            ]}
          />
        </div>

        {/* Description */}
        <p className="text-[#B0B6C1] text-sm mb-4">
          {department.description}
        </p>

        {/* Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <UserCheck className="w-4 h-4 text-[#00AEEF]" aria-hidden="true" />
            <span className="text-[#B0B6C1]">Manager:</span>
            <span className="text-white">{department.headOfDepartment}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-[#00AEEF]" aria-hidden="true" />
            <span className="text-[#B0B6C1]">Team Size:</span>
            <span className="text-white">{department.employeeCount} members</span>
          </div>
        </div>

        {/* Performance Progress */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#B0B6C1] text-sm">Avg Performance</span>
            <span className="text-white">{performanceScore}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]"
              style={{ width: `${performanceScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
