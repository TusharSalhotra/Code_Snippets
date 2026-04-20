import { KPI, KPIStatus } from '../types';
import { KPI_STATUS_COLORS } from '../constants';

/**
 * Get KPI status badge classes
 */
export function getKPIStatusBadgeClasses(status: KPIStatus): string {
  return KPI_STATUS_COLORS[status] || 'border-white/10 text-[#B0B6C1]';
}

/**
 * Filter KPIs by search query
 */
export function filterKPIsBySearch(kpis: KPI[], query: string): KPI[] {
  if (!query.trim()) {
    return kpis;
  }

  const searchLower = query.toLowerCase();

  return kpis.filter((kpi) => {
    const nameMatch = kpi.name.toLowerCase().includes(searchLower);
    const departmentMatch = kpi.department.toLowerCase().includes(searchLower);

    return nameMatch || departmentMatch;
  });
}

/**
 * Filter KPIs by status
 */
export function filterKPIsByStatus(kpis: KPI[], status: KPIStatus | 'all'): KPI[] {
  if (status === 'all') {
    return kpis;
  }

  return kpis.filter((kpi) => kpi.status === status);
}

/**
 * Filter KPIs by department
 */
export function filterKPIsByDepartment(kpis: KPI[], department: string): KPI[] {
  if (!department || department === 'all') {
    return kpis;
  }

  return kpis.filter((kpi) => kpi.department === department);
}

/**
 * Filter AI-generated KPIs
 */
export function filterAIGeneratedKPIs(kpis: KPI[]): KPI[] {
  return kpis.filter((kpi) => kpi.isAIGenerated);
}

/**
 * Sort KPIs by weight (descending)
 */
export function sortKPIsByWeight(kpis: KPI[]): KPI[] {
  return [...kpis].sort((a, b) => b.weight - a.weight);
}

/**
 * Sort KPIs by name (ascending)
 */
export function sortKPIsByName(kpis: KPI[]): KPI[] {
  return [...kpis].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get total weight for a department
 */
export function getTotalWeightByDepartment(kpis: KPI[], department: string): number {
  return kpis
    .filter((kpi) => kpi.department === department && kpi.status === 'active')
    .reduce((total, kpi) => total + kpi.weight, 0);
}

/**
 * Get unique departments from KPIs
 */
export function getUniqueDepartments(kpis: KPI[]): string[] {
  const departments = new Set(kpis.map((kpi) => kpi.department));
  return Array.from(departments).sort();
}

/**
 * Get KPI statistics
 */
export function getKPIStats(kpis: KPI[]) {
  const totalKPIs = kpis.length;
  const activeKPIs = kpis.filter((k) => k.status === 'active').length;
  const draftKPIs = kpis.filter((k) => k.status === 'draft').length;
  const aiGeneratedKPIs = kpis.filter((k) => k.isAIGenerated).length;
  const departments = getUniqueDepartments(kpis);

  return {
    totalKPIs,
    activeKPIs,
    draftKPIs,
    aiGeneratedKPIs,
    departmentCount: departments.length,
    departments,
  };
}

/**
 * Validate KPI weight total for department
 */
export function validateDepartmentWeights(kpis: KPI[], department: string): {
  isValid: boolean;
  total: number;
  message?: string;
} {
  const total = getTotalWeightByDepartment(kpis, department);

  if (total > 100) {
    return {
      isValid: false,
      total,
      message: `Total weight for ${department} exceeds 100% (${total}%)`,
    };
  }

  return {
    isValid: true,
    total,
  };
}

/**
 * Check if KPI name is unique within department
 */
export function isKPINameUnique(
  kpis: KPI[],
  name: string,
  department: string,
  excludeId?: string
): boolean {
  return !kpis.some(
    (kpi) =>
      kpi.name.toLowerCase() === name.toLowerCase() &&
      kpi.department === department &&
      kpi.id !== excludeId
  );
}
