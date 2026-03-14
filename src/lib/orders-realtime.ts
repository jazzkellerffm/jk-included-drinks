"use client";

import { useEffect } from "react";
import { getSupabase } from "./supabase";

/**
 * Subscribe to Supabase Realtime postgres_changes on public.orders.
 * Calls onChanges whenever a row is inserted or updated (e.g. new order or marked served).
 * Use this to refetch open/served lists so the UI updates instantly.
 */
export function useOrdersRealtime(onChange: () => void): void {
  useEffect(() => {
    const supabase = getSupabase();
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => onChange()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
