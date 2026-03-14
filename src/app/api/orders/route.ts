import { NextResponse } from "next/server";
import {
  getOpenOrders,
  getServedOrders,
  getTotalDrinkCountForTableAndCode,
  insertOrder,
  type OrderRow,
} from "@/lib/orders-supabase";
import { getDrinkById } from "@/lib/drinks";
import { getIncludedDrinksForCode } from "@/lib/access-codes";

export const dynamic = "force-dynamic";

function toOrder(order: OrderRow) {
  return {
    id: order.id,
    tableOrGuest: order.table_number,
    guestName: order.guest_name ?? undefined,
    accessCode: order.access_code,
    items: order.items,
    status: order.status,
    createdAt: order.created_at,
    completedAt: order.completed_at ?? undefined,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "all";

  try {
    if (status === "open") {
      const orders = await getOpenOrders();
      return NextResponse.json({ orders: orders.map(toOrder) });
    }
    if (status === "completed") {
      const orders = await getServedOrders();
      return NextResponse.json({ orders: orders.map(toOrder) });
    }
    const [open, served] = await Promise.all([getOpenOrders(), getServedOrders()]);
    return NextResponse.json({
      open: open.map(toOrder),
      completed: served.map(toOrder),
    });
  } catch (e) {
    console.error("GET /api/orders", e);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { tableOrGuest, guestName, accessCode, items } = body as {
    tableOrGuest?: string;
    guestName?: string;
    accessCode?: string;
    items?: { drinkId: string; quantity: number }[];
  };

  if (!tableOrGuest?.trim() || !items?.length) {
    return NextResponse.json(
      { error: "tableOrGuest and items required" },
      { status: 400 }
    );
  }

  if (!accessCode?.trim()) {
    return NextResponse.json({ error: "accessCode required" }, { status: 400 });
  }

  const code = accessCode.trim().toUpperCase();
  const included = getIncludedDrinksForCode(code);
  if (included === null) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 400 });
  }

  const orderItems = items
    .filter((i) => i.quantity > 0)
    .map((i) => {
      const drink = getDrinkById(i.drinkId);
      return {
        drinkId: i.drinkId,
        drinkName: drink?.name ?? i.drinkId,
        quantity: i.quantity,
      };
    })
    .filter((i) => i.quantity > 0);

  if (orderItems.length === 0) {
    return NextResponse.json(
      { error: "At least one drink with quantity > 0 required" },
      { status: 400 }
    );
  }

  const table = tableOrGuest.trim();
  const totalInOrder = orderItems.reduce((s, i) => s + i.quantity, 0);

  try {
    const alreadyOrdered = await getTotalDrinkCountForTableAndCode(table, code);

    if (alreadyOrdered + totalInOrder > included) {
      return NextResponse.json(
        {
          error: "Included drinks limit reached",
          remaining: Math.max(0, included - alreadyOrdered),
        },
        { status: 400 }
      );
    }

    const order = await insertOrder({
      table_number: table,
      access_code: code,
      guest_name: guestName?.trim() || null,
      items: orderItems,
      drink_count: totalInOrder,
    });

    const remaining = Math.max(0, included - alreadyOrdered - totalInOrder);

    if (!order) {
      return NextResponse.json({
        ok: true,
        tableOrGuest: table,
        guestName: guestName?.trim() || undefined,
        accessCode: code,
        items: orderItems,
        status: "open",
        remaining,
      });
    }

    try {
      return NextResponse.json({
        ok: true,
        remaining,
        ...toOrder(order),
      });
    } catch (serializeError) {
      console.error("POST /api/orders response serialize", serializeError);
      return NextResponse.json({ ok: true, remaining });
    }
  } catch (e) {
    console.error("POST /api/orders", e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}