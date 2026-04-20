'use client';

import { Target, Brain, Edit } from 'lucide-react';
import { KPI } from '../types';
import { StatusBadge } from '@/src/shared/components';
import { Button } from '@/components/ui/button';

interface KPIListItemProps {
  kpi: KPI;
  onEdit?: (kpi: KPI) => void;
}

export function KPIListItem({ kpi, onEdit }: KPIListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Target className="w-5 h-5 text-[#00F5C6]" aria-hidden="true" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-white">{kpi.name}</p>
            {kpi.isAIGenerated && (
              <span
                data-slot="badge"
                className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-accent [a&]:hover:text-accent-foreground border-[#00AEEF]/50 text-[#00AEEF]"
              >
                <Brain className="w-3 h-3 mr-1" aria-hidden="true" />
                AI
              </span>
            )}
          </div>
          <p className="text-[#B0B6C1] text-sm">
            {kpi.department} · Weight: {kpi.weight}%
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={kpi.status} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(kpi)}
          className="text-[#B0B6C1] hover:text-white"
        >
          <Edit className="w-4 h-4 mr-1.5" />
          Edit
        </Button>
      </div>
    </div>
  );
}
