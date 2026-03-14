"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import type { Order } from "@/lib/types";
import { useOrdersRealtime } from "@/lib/orders-realtime";

function tableDisplay(tableOrGuest: string): string {
  const n = tableOrGuest.replace(/^table\s*/i, "").trim() || tableOrGuest;
  return `TABLE ${n.toUpperCase()}`;
}

function formatCreatedTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderCard({
  order,
  onServed,
}: {
  order: Order;
  onServed: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border-2 border-jazz-gold/40 bg-jazz-charcoal p-5 md:p-6 flex flex-col min-h-[200px] shadow-xl">
      <div className="flex flex-1 flex-col min-w-0">
        <p className="font-polysans-bulky text-3xl md:text-4xl font-bold text-jazz-gold mb-1 truncate">
          {tableDisplay(order.tableOrGuest)}
        </p>
        {order.guestName?.trim() && (
          <p className="font-sans text-jazz-cream-dim text-sm mb-2">
            {order.guestName.trim()}
          </p>
        )}
        <p className="font-sans text-jazz-cream-dim text-xs mb-2">
          {formatCreatedTime(order.createdAt)}
        </p>
        <ul className="font-sans space-y-1 text-jazz-cream text-lg flex-1">
          {order.items.map((item, i) => (
            <li key={i}>
              <span className="font-polysans-bulky text-jazz-gold-dim">{item.quantity}×</span>{" "}
              {item.drinkName}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => onServed(order.id)}
        className="mt-4 w-full min-h-[3.5rem] rounded-xl bg-jazz-gold text-jazz-black font-polysans-bulky font-bold text-xl active:scale-[0.98] touch-manipulation"
      >
        SERVED
      </button>
    </article>
  );
}

export default function BarDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpen = useCallback(async () => {
    const res = await fetch("/api/orders?status=open", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOpen();
  }, [fetchOpen]);

  useOrdersRealtime(fetchOpen);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  async function markServed(orderId: string) {
    const res = await fetch(`/api/orders/${orderId}/complete`, {
      method: "PATCH",
    });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    }
  }

  return (
    <main className="min-h-screen h-screen flex flex-col bg-jazz-black overflow-hidden">
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-jazz-smoke">
        <div>
          <h1 className="font-ace font-bold text-2xl md:text-3xl text-jazz-gold">
            Bar — Open orders
          </h1>
          <p className="font-sans text-jazz-cream-dim text-sm mt-0.5">
            Newest first · Tap SERVED when done
          </p>
        </div>
        <Link
          href="/history"
          className="min-h-touch px-5 py-3 rounded-xl bg-jazz-smoke border border-jazz-gold-dim text-jazz-gold font-polysans-bulky font-medium text-lg"
        >
          History
        </Link>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {loading ? (
          <p className="font-sans text-jazz-cream-dim">Loading…</p>
        ) : sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-sans text-jazz-cream-dim text-xl">
              No open orders
            </p>
            <p className="font-sans text-jazz-cream-dim/80 mt-2 text-sm">
              New orders will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {sortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onServed={markServed}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
