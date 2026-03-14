"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import type { Order } from "@/lib/types";
import { useOrdersRealtime } from "@/lib/orders-realtime";

function tableDisplay(tableOrGuest: string): string {
  const n = tableOrGuest.replace(/^table\s*/i, "").trim() || tableOrGuest;
  return `TABLE ${n.toUpperCase()}`;
}

function formatServedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistoryCard({ order }: { order: Order }) {
  const servedAt = order.completedAt ?? order.createdAt;

  return (
    <li className="rounded-2xl border border-jazz-smoke bg-jazz-charcoal p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <span className="font-polysans-bulky text-xl text-jazz-gold">
          {tableDisplay(order.tableOrGuest)}
        </span>
        <span className="font-sans text-jazz-cream-dim text-sm">
          Served {formatServedTime(servedAt)}
        </span>
      </div>
      {order.guestName?.trim() && (
        <p className="font-sans text-jazz-cream-dim text-sm mb-2">
          {order.guestName.trim()}
        </p>
      )}
      <ul className="font-sans text-jazz-cream space-y-0.5">
        {order.items.map((item, i) => (
          <li key={i}>
            <span className="font-polysans-bulky text-jazz-gold-dim">{item.quantity}×</span>{" "}
            {item.drinkName}
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServed = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?status=completed", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = res.ok ? await res.json() : {};
      const list = data?.orders;
      setOrders(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServed();
  }, [fetchServed]);

  useOrdersRealtime(fetchServed);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => {
        const at = (a.completedAt ?? a.createdAt);
        const bt = (b.completedAt ?? b.createdAt);
        return new Date(bt).getTime() - new Date(at).getTime();
      }),
    [orders]
  );

  return (
    <main className="min-h-screen bg-jazz-black p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-ace font-bold text-3xl md:text-4xl text-jazz-gold">
            History
          </h1>
          <p className="font-sans text-jazz-cream-dim mt-1">Served orders</p>
        </div>
        <Link
          href="/bar"
          className="min-h-touch px-6 py-3 rounded-xl bg-jazz-smoke border border-jazz-gold-dim text-jazz-gold font-polysans-bulky font-medium"
        >
          Back to bar
        </Link>
      </header>

      {loading ? (
        <p className="font-sans text-jazz-cream-dim">Loading…</p>
      ) : sortedOrders.length === 0 ? (
        <p className="font-sans text-jazz-cream-dim">No served orders yet.</p>
      ) : (
        <ul className="space-y-4 max-w-2xl">
          {sortedOrders.map((order) => (
            <HistoryCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </main>
  );
}
