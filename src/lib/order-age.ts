/**
 * Order age in minutes (rounded down).
 */
export function getOrderAgeMinutes(createdAtIso: string, now: Date): number {
  const created = new Date(createdAtIso).getTime();
  const diffMs = now.getTime() - created;
  return Math.floor(diffMs / 60_000);
}

/**
 * Human-readable age string, e.g. "0 min", "3 min", "1 hr 5 min".
 */
export function formatOrderAge(createdAtIso: string, now: Date): string {
  const created = new Date(createdAtIso).getTime();
  const diffMs = now.getTime() - created;
  const totalMinutes = Math.floor(diffMs / 60_000);
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

export type AgeTier = "normal" | "warning" | "urgent";

/**
 * 0–2 min: normal, 3–5 min: warning (yellow), 6+ min: urgent (red).
 */
export function getAgeTier(minutes: number): AgeTier {
  if (minutes <= 2) return "normal";
  if (minutes <= 5) return "warning";
  return "urgent";
}
