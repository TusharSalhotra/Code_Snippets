export function validatePasswordPolicy(policy: string): boolean {
  return ['weak', 'medium', 'strong'].includes(policy);
}
