"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { DRINKS } from "@/lib/drinks";
import { DrinkThumbnail } from "@/components/DrinkThumbnail";

const SESSION_KEY = "jk-drinks-session";

type Session = {
  tableNumber: string;
  accessCode: string;
  includedDrinksTotal: number;
};

type CartItem = { drinkId: string; drinkName: string; quantity: number };

function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Session;
    if (
      !data ||
      typeof data.tableNumber !== "string" ||
      typeof data.accessCode !== "string" ||
      typeof data.includedDrinksTotal !== "number"
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

function GuestOrderPageContent() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const [showCodeEntry, setShowCodeEntry] = useState(true);
  const [showOrderingScreen, setShowOrderingScreen] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [guestName, setGuestName] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validateError, setValidateError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  const fetchRemaining = useCallback(
    async (tableNumber: string, accessCode: string) => {
      const params = new URLSearchParams({
        accessCode,
        tableNumber: tableNumber || "_",
      });
      const res = await fetch(`/api/access/remaining?${params}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.remaining as number;
    },
    []
  );

  useEffect(() => {
    const saved = getSession();
    if (!saved) {
      setShowCodeEntry(true);
      setSession(null);
      setRemaining(null);
      setShowOrderingScreen(false);
      return;
    }
    setSession(saved);
    setShowCodeEntry(false);
    setShowOrderingScreen(false);
    setRemaining(null);
    fetchRemaining(saved.tableNumber, saved.accessCode).then((r) => {
      if (r === null) {
        clearSession();
        setSession(null);
        setShowCodeEntry(true);
      } else {
        setRemaining(r);
      }
    });
  }, [searchParams, fetchRemaining]);

  const activeDrinks = DRINKS.filter((d) => d.active !== false);
  const byCategory = activeDrinks.reduce<Record<string, typeof DRINKS>>((acc, d) => {
    (acc[d.category] = acc[d.category] ?? []).push(d);
    return acc;
  }, {});

  const cartTotal = cart.reduce((s, c) => s + c.quantity, 0);
  const canAddMore = remaining !== null && cartTotal < remaining;

  function addToCart(drinkId: string, drinkName: string) {
    if (!canAddMore) return;
    setCart((prev) => {
      const i = prev.findIndex((x) => x.drinkId === drinkId);
      const currentTotal = prev.reduce((s, x) => s + x.quantity, 0);
      const maxNew = remaining! - currentTotal;
      if (i >= 0) {
        const next = [...prev];
        const newQty = Math.min(next[i].quantity + 1, maxNew);
        if (newQty <= 0) return prev;
        next[i] = { ...next[i], quantity: newQty };
        return next;
      }
      if (maxNew < 1) return prev;
      return [...prev, { drinkId, drinkName, quantity: 1 }];
    });
  }

  function adjustQuantity(drinkId: string, delta: number) {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.drinkId === drinkId);
      if (i < 0) return prev;
      const next = [...prev];
      const q = next[i].quantity + delta;
      if (q <= 0) return next.filter((_, idx) => idx !== i);
      next[i] = { ...next[i], quantity: q };
      return next;
    });
  }

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const table = (form.querySelector('[name="tableNumber"]') as HTMLInputElement)?.value?.trim();
    const code = (form.querySelector('[name="accessCode"]') as HTMLInputElement)?.value?.trim();
    if (!code) {
      setValidateError("Enter access code");
      return;
    }
    setValidateError(null);
    setValidating(true);
    try {
      const res = await fetch("/api/access/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: table ?? "",
          accessCode: code,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.valid) {
        const tableNum = ((table ?? "").trim()) || (searchParams.get("table") ?? "");
        const sess: Session = {
          tableNumber: tableNum,
          accessCode: code.toUpperCase(),
          includedDrinksTotal: data.includedDrinksTotal,
        };
        saveSession(sess);
        setSession(sess);
        setRemaining(data.remaining);
        setShowCodeEntry(false);
        setShowOrderingScreen(false);
      } else {
        setValidateError(data.error ?? "Invalid access code");
      }
    } catch {
      setValidateError("Could not validate. Try again.");
    } finally {
      setValidating(false);
    }
  }

  async function submitOrder(e?: React.FormEvent) {
    e?.preventDefault();
    if (!session || remaining === null || remaining < 1) return;
    if (cart.length === 0) return;
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableOrGuest: session.tableNumber || "Table",
          ...(guestName.trim() && { guestName: guestName.trim() }),
          accessCode: session.accessCode,
          items: cart.map((c) => ({
            drinkId: c.drinkId,
            drinkName: c.drinkName,
            quantity: c.quantity,
          })),
          status: "open",
        }),
      });
      const data = await res.json().catch(() => ({}));
      const isSuccess =
        res.ok || (res.status === 200 && (data?.ok === true || typeof data?.remaining === "number"));
      if (isSuccess) {
        setError(null);
        setSent(true);
        setCart([]);
        if (typeof data.remaining === "number") setRemaining(data.remaining);
      } else {
        setError(data?.error ?? `Request failed (${res.status})`);
        if (data?.remaining !== undefined) setRemaining(data.remaining);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send order");
    } finally {
      setSending(false);
    }
  }

  if (showCodeEntry) {
    return (
      <main className="min-h-screen bg-jazz-black p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="font-ace font-bold text-2xl md:text-3xl text-jazz-gold mb-2 text-center">
            JK Drinks
          </h1>
          <p className="font-sans text-jazz-cream-dim text-center mb-2 text-sm">
            Enter your table number and code
          </p>
          <p className="font-sans text-jazz-cream-dim/90 text-center mb-6 text-xs max-w-xs mx-auto leading-relaxed">
            Bitte gebt die inkludierten Getränke pro Tisch gesammelt über ein Handy ein.
            <span className="block mt-1.5 text-jazz-cream-dim/80">
              Please place all included drink orders for one table on one phone.
            </span>
          </p>
          <form onSubmit={handleValidate} className="space-y-4">
            <div>
              <label className="font-sans block text-jazz-cream-dim text-sm font-medium mb-2">
                Table number
              </label>
              <input
                name="tableNumber"
                type="text"
                defaultValue={searchParams.get("table") ?? ""}
                placeholder="e.g. 3 or Table 5"
                className="font-sans w-full min-h-touch-lg px-4 rounded-xl bg-jazz-charcoal border border-jazz-smoke text-jazz-cream placeholder-jazz-cream-dim focus:border-jazz-gold focus:outline-none text-lg"
              />
            </div>
            <div>
              <label className="font-sans block text-jazz-cream-dim text-sm font-medium mb-2">
                Access code
              </label>
              <input
                name="accessCode"
                type="text"
                placeholder="e.g. JK2"
                className="font-sans w-full min-h-touch-lg px-4 rounded-xl bg-jazz-charcoal border border-jazz-smoke text-jazz-cream placeholder-jazz-cream-dim focus:border-jazz-gold focus:outline-none text-lg normal-case"
                autoComplete="off"
              />
            </div>
            {validateError && (
              <p className="font-sans text-red-400 text-sm" role="alert">
                {validateError}
              </p>
            )}
            <button
              type="submit"
              disabled={validating}
              className="w-full min-h-touch-lg rounded-xl bg-jazz-gold text-jazz-black font-polysans-bulky font-semibold text-lg disabled:opacity-50"
            >
              {validating ? "Checking…" : "Continue"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (session && !showOrderingScreen && remaining !== null && remaining !== 0) {
    const tableLabel = session.tableNumber ? `Table ${session.tableNumber}` : "Table";
    return (
      <main className="min-h-screen bg-jazz-black flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-polysans-bulky text-2xl md:text-3xl text-jazz-gold tracking-wide">
            {tableLabel}
          </p>
          <p className="font-sans text-jazz-cream-dim mt-4 text-lg">
            Drinks remaining: <span className="font-polysans-bulky text-jazz-cream">{remaining}</span>
          </p>
          <button
            type="button"
            onClick={() => setShowOrderingScreen(true)}
            className="mt-10 w-full min-h-touch-lg rounded-xl bg-jazz-gold text-jazz-black font-polysans-bulky font-semibold text-lg active:scale-[0.98]"
          >
            Order drinks
          </button>
        </div>
      </main>
    );
  }

  if (sent && session) {
    return (
      <main className="min-h-screen bg-jazz-black p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-ace font-bold text-xl md:text-2xl text-jazz-gold mb-3">
            Order sent to the bar
          </h1>
          <p className="font-sans text-jazz-cream-dim text-sm mb-4">
            Your drinks are being prepared.
          </p>
          <p className="font-sans text-jazz-cream-dim mb-1">
            {session.tableNumber ? `Table ${session.tableNumber}` : "Table"}
          </p>
          {remaining !== null && (
            <p className="font-sans text-jazz-cream-dim mb-6">
              Drinks remaining: <span className="font-polysans-bulky text-jazz-gold">{remaining}</span>
            </p>
          )}
          {remaining !== null && remaining > 0 && (
            <button
              type="button"
              onClick={() => setSent(false)}
              className="min-h-touch rounded-lg px-6 py-3 font-polysans-bulky font-semibold text-sm text-jazz-black bg-jazz-gold active:scale-[0.98]"
            >
              New order
            </button>
          )}
          {remaining !== null && remaining === 0 && (
            <>
              <p className="font-sans text-jazz-cream mt-4">
                Alle inkludierten Getränke wurden eingelöst.
              </p>
              <p className="font-sans text-jazz-cream-dim mt-1 text-sm">
                Für weitere Bestellungen nutzt bitte den QR-Code am Tisch.
              </p>
              <p className="font-sans text-jazz-cream mt-3 text-sm">
                All included drinks have been used.
              </p>
              <p className="font-sans text-jazz-cream-dim mt-1 text-sm">
                For additional orders, please use the QR code on the table.
              </p>
            </>
          )}
        </div>
      </main>
    );
  }

  if (session && remaining === 0 && !sent) {
    return (
      <main className="min-h-screen bg-jazz-black p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <p className="font-polysans-bulky text-lg text-jazz-gold">
            Table {session.tableNumber || "—"}
          </p>
          <p className="font-sans text-jazz-cream mt-3 text-sm">
            Alle inkludierten Getränke wurden eingelöst.
          </p>
          <p className="font-sans text-jazz-cream-dim mt-1 text-sm">
            Für weitere Bestellungen nutzt bitte den QR-Code am Tisch.
          </p>
          <p className="font-sans text-jazz-cream mt-3 text-sm">
            All included drinks have been used.
          </p>
          <p className="font-sans text-jazz-cream-dim mt-1 text-sm">
            For additional orders, please use the QR code on the table.
          </p>
        </div>
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-jazz-black p-4 pb-36">
      <div className="mx-auto max-w-sm">
        <header className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="font-polysans-bulky text-lg text-jazz-gold">
              Table {session.tableNumber || "—"}
            </p>
            <p className="font-sans text-jazz-cream-dim text-xs mt-0.5">
              Drinks remaining: <span className="font-polysans-bulky text-jazz-gold">{remaining}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowOrderingScreen(false)}
            className="font-polysans-bulky text-jazz-cream-dim/80 text-sm underline hover:text-jazz-cream min-h-touch shrink-0"
          >
            Back
          </button>
        </header>

        <section className="mb-4">
          <label className="font-sans block text-jazz-cream-dim text-xs font-medium mb-1.5">
            Your name <span className="text-jazz-cream-dim/70">(optional)</span>
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="e.g. John"
            className="font-sans w-full min-h-[2.75rem] px-3 rounded-lg bg-jazz-charcoal border border-jazz-smoke text-jazz-cream text-sm placeholder-jazz-cream-dim focus:border-jazz-gold focus:outline-none"
          />
        </section>

        <section>
          <h2 className="font-ace font-bold text-base text-jazz-gold mb-3">
            Choose drinks
          </h2>
          <div className="space-y-4">
            {Object.entries(byCategory).map(([category, drinks]) => (
              <div key={category}>
                <h3 className="font-ace font-bold text-jazz-cream-dim text-xs mb-1.5 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-1">
                  {drinks.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => addToCart(d.id, d.name)}
                      disabled={!canAddMore}
                      className="flex w-full items-center gap-2.5 rounded-lg bg-jazz-smoke/80 border border-jazz-charcoal py-2 px-2.5 text-left active:bg-jazz-charcoal active:border-jazz-gold-dim transition-colors disabled:opacity-50 disabled:pointer-events-none touch-manipulation min-h-[3.25rem]"
                    >
                      <DrinkThumbnail
                        src={d.image}
                        className="h-10 w-10 shrink-0 rounded-md object-cover bg-jazz-charcoal"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-ace font-bold text-jazz-cream block truncate text-sm">
                          {d.name}
                        </span>
                        {d.subtitle && (
                          <span className="font-sans text-jazz-cream-dim block truncate text-xs">
                            {d.subtitle}
                          </span>
                        )}
                        {d.flavorMarker && (
                          <span className="font-sans text-jazz-cream-dim/80 block truncate text-xs italic">
                            {d.flavorMarker}
                          </span>
                        )}
                      </div>
                      <span className="font-polysans-bulky shrink-0 text-jazz-gold text-xs">
                        Add
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {cart.length > 0 && (
        <section className="fixed bottom-0 left-0 right-0 z-10 border-t-2 border-jazz-smoke bg-jazz-charcoal shadow-[0_-4px_16px_rgba(0,0,0,0.4)] pt-4 pb-5 px-4">
          <form
            onSubmit={submitOrder}
            className="mx-auto max-w-sm flex flex-col"
            noValidate
          >
            <h3 className="font-sans text-jazz-cream-dim text-xs font-medium mb-2">
              Your order
              {remaining !== null && (
                <span className="font-polysans-bulky ml-1 text-jazz-gold">
                  (up to {remaining})
                </span>
              )}
            </h3>
            <ul className="min-h-0 max-h-[7.5rem] space-y-1.5 overflow-y-auto overscroll-contain py-0.5 -mx-0.5 px-0.5 font-sans text-sm">
              {cart.map((c) => (
                <li key={c.drinkId} className="flex items-center justify-between gap-2 py-0.5">
                  <span className="truncate text-jazz-cream">{c.drinkName}</span>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => adjustQuantity(c.drinkId, -1)}
                      className="h-8 w-8 rounded-md bg-jazz-smoke text-jazz-gold font-polysans-bulky text-sm leading-none touch-manipulation"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-polysans-bulky text-sm">{c.quantity}</span>
                    <button
                      type="button"
                      onClick={() => adjustQuantity(c.drinkId, 1)}
                      disabled={cartTotal >= (remaining ?? 0)}
                      className="h-8 w-8 rounded-md bg-jazz-smoke text-jazz-gold font-polysans-bulky text-sm leading-none disabled:opacity-50 disabled:pointer-events-none touch-manipulation"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {error && (
              <p className="mt-2 font-sans text-red-400 text-xs" role="alert">
                {error}
              </p>
            )}
            <div className="mt-4 pt-3 border-t border-jazz-smoke">
              <button
                type="submit"
                disabled={sending}
                className="w-full min-h-[3.25rem] rounded-xl bg-jazz-gold py-3 font-polysans-bulky font-semibold text-base text-jazz-black disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] touch-manipulation"
              >
                {sending ? "Sending…" : "Send order"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
export default function GuestOrderPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-jazz-black" />}>
      <GuestOrderPageContent />
    </Suspense>
  );
}