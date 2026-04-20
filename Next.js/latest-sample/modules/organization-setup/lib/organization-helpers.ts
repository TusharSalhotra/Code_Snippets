export function validateOrganizationName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}
