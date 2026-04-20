export function maskAPIKey(key: string): string {
  return key.slice(0, 12) + '...';
}
