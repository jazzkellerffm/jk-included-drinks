import { getSupabase, getSupabaseServer } from "./supabase";

export type OrderRow = {
  id: string;
  table_number: string;
  access_code: string;
  guest_name: string | null;
  items: { drinkId: string; drinkName: string; quantity: number }[];
  drink_count: number;
  status: "open" | "served";
  created_at: string;
  completed_at: string | null;
};

/** Sum of drink_count for this table_number + access_code (all orders). */
export async function getTotalDrinkCountForTableAndCode(
  tableNumber: string,
  accessCode: string
): Promise<number> {
  const table = (tableNumber ?? "").trim() || "_";
  const code = (accessCode ?? "").trim().toUpperCase();

  const { data, error } = await getSupabase()
    .from("orders")
    .select("drink_count")
    .eq("table_number", table)
    .eq("access_code", code);

  if (error) return 0;
  const total = (data ?? []).reduce((s, r) => s + (r.drink_count ?? 0), 0);
  return total;
}

/** All orders with status = 'open', for Bar. */
export async function getOpenOrders(): Promise<OrderRow[]> {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as OrderRow[];
}

/** All orders with status = 'served', for History. */
export async function getServedOrders(): Promise<OrderRow[]> {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("status", "served")
    .order("completed_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as OrderRow[];
}

/** Insert a new order with status = 'open'. Uses server client so writes succeed regardless of RLS. */
export async function insertOrder(row: {
  table_number: string;
  access_code: string;
  guest_name: string | null;
  items: { drinkId: string; drinkName: string; quantity: number }[];
  drink_count: number;
}): Promise<OrderRow | null> {
  const payload = {
    table_number: row.table_number,
    access_code: row.access_code,
    guest_name: row.guest_name,
    items: JSON.parse(JSON.stringify(row.items)) as { drinkId: string; drinkName: string; quantity: number }[],
    drink_count: row.drink_count,
    status: "open" as const,
  };

  const { data, error } = await getSupabaseServer()
    .from("orders")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("insertOrder error", error.code, error.message, error.details);
    return null;
  }
  return data as OrderRow;
}

/** Set order to served and set completed_at. */
export async function markOrderServed(orderId: string): Promise<OrderRow | null> {
  const now = new Date().toISOString();
  const { data, error } = await getSupabaseServer()
    .from("orders")
    .update({ status: "served", completed_at: now })
    .eq("id", orderId)
    .eq("status", "open")
    .select()
    .single();

  if (error) return null;
  return data as OrderRow;
}
