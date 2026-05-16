/** UUID v4 from crypto.randomUUID(), used as redemption / session id. */
const SESSION_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidSessionId(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const s = value.trim();
  return s.length > 0 && SESSION_ID_REGEX.test(s);
}
