export function calculateTokenUsagePercentage(used: number, total: number): number {
  return Math.round((used / total) * 100);
}
