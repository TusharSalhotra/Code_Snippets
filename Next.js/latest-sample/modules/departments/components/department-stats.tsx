/**
 * DepartmentStats Component
 * Display department statistics
 */

import { Building2, Users, TrendingUp } from 'lucide-react';

interface DepartmentStatsProps {
  totalDepartments: number;
  activeDepartments: number;
  totalEmployees: number;
}

export function DepartmentStats({
  totalDepartments,
  activeDepartments,
  totalEmployees,
}: DepartmentStatsProps) {
  const stats = [
    {
      label: 'Total Departments',
      value: totalDepartments,
      icon: Building2,
      color: 'from-[#00F5C6] to-[#00AEEF]',
    },
    {
      label: 'Total Employees',
      value: totalEmployees,
      icon: Users,
      color: 'from-[#00AEEF] to-[#0066CC]',
    },
    {
      label: 'Avg Performance',
      value: '84%',
      icon: TrendingUp,
      color: 'from-[#00F5C6]/30 to-[#00AEEF]/30',
      iconColor: 'text-[#00F5C6]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="relative group">
          <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor || 'text-white'}`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">{stat.label}</p>
                <p className="text-white text-2xl">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
