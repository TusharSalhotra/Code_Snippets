'use client';

import { Shield, Lock, Users } from 'lucide-react';

interface RoleStatsProps {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
}

const defaultStats: RoleStatsProps = {
  totalRoles: 5,
  systemRoles: 3,
  customRoles: 2,
};

export function RoleStats({
  totalRoles = defaultStats.totalRoles,
  systemRoles = defaultStats.systemRoles,
  customRoles = defaultStats.customRoles,
}: Partial<RoleStatsProps> = {}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Roles */}
      <div className="relative group ">
        <div className="relative p-3 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[#B0B6C1] text-sm">Total Roles</p>
              <p className="text-white text-2xl">{totalRoles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Roles */}
      <div className="relative group ">
        <div className="relative p-3 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0066CC] flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[#B0B6C1] text-sm">System Roles</p>
              <p className="text-white text-2xl">{systemRoles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Roles */}
      <div className="relative group">
        <div className="relative p-3 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6]/30 to-[#00AEEF]/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#00F5C6]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-[#B0B6C1] text-sm">Custom Roles</p>
              <p className="text-white text-2xl">{customRoles}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
