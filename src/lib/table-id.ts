export const TABLE_ID_REGEX = /^(?:[1-9]|1\d|2[0-9]|B[1-4]|D[1-2])$/;

/**
 * Normalize a user-entered table identifier.
 * - trims whitespace
 * - uppercases
 * Returns the normalized value or null if empty/invalid.
 */
export function normalizeTableId(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const v = input.trim().toUpperCase();
  if (!v) return null;
  return TABLE_ID_REGEX.test(v) ? v : null;
}

