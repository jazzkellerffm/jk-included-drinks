import type { Order } from "./types";

const openOrders: Order[] = [];
const completedOrders: Order[] = [];

/**
 * In-memory store: total drinks ordered per table + access code.
 * Key format: "tableNumber_accessCode" (e.g. "12_JK3", "5_JK2").
 * Used to calculate remaining = allowed_drinks - this count.
 */
const drinksByTableAndCode: Record<string, number> = {};

function tableCodeKey(tableNumber: string, accessCode: string): string {
  const table = (tableNumber ?? "").trim() || "_";
  const code = (accessCode ?? "").trim().toUpperCase();
  return `${table}_${code}`;
}

export function getOpenOrders(): Order[] {
  return [...openOrders];
}

export function getCompletedOrders(): Order[] {
  return [...completedOrders];
}

/** Total drinks ever ordered for this table + access code (server authority for remaining). */
export function getTotalOrderedDrinksForTableAndCode(
  tableNumber: string,
  accessCode: string
): number {
  const key = tableCodeKey(tableNumber, accessCode);
  return drinksByTableAndCode[key] ?? 0;
}

export function addOrder(
  order: Omit<Order, "id" | "status" | "createdAt">
): Order {
  const full: Order = {
    ...order,
    id: crypto.randomUUID(),
    status: "open",
    createdAt: new Date().toISOString(),
  };
  openOrders.push(full);

  const key = tableCodeKey(order.tableOrGuest, order.accessCode);
  const totalInOrder = order.items.reduce((s, i) => s + i.quantity, 0);
  drinksByTableAndCode[key] = (drinksByTableAndCode[key] ?? 0) + totalInOrder;

  return full;
}

/**
 * Mark order as served: set status and completedAt, move to completed. Removes from Bar queue.
 */
export function completeOrder(orderId: string): Order | null {
  const idx = openOrders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;
  const order = openOrders.splice(idx, 1)[0];
  const completed: Order = {
    ...order,
    status: "served",
    completedAt: new Date().toISOString(),
  };
  completedOrders.unshift(completed);
  return completed;
}

/** Clear all orders and drink counts so the next event starts clean. */
export function clear(): void {
  openOrders.length = 0;
  completedOrders.length = 0;
  for (const key of Object.keys(drinksByTableAndCode)) {
    delete drinksByTableAndCode[key];
  }
}
