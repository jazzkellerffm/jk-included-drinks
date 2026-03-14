/**
 * Access codes and their included drinks limit.
 * In production, load from env or database.
 * Input is normalized to uppercase.
 */
const ACCESS_CODES: Record<string, number> = {
  JK1: 1,
  JK2: 2,
  JK3: 3,
  JK4: 4,
};

export function getIncludedDrinksForCode(accessCode: string): number | null {
  const code = accessCode?.trim().toUpperCase();
  if (!code || !(code in ACCESS_CODES)) return null;
  return ACCESS_CODES[code];
}

export function isCodeValid(accessCode: string): boolean {
  return getIncludedDrinksForCode(accessCode) !== null;
}
