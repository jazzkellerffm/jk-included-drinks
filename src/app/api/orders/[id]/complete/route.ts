import { NextResponse } from "next/server";
import { markOrderServed } from "@/lib/orders-supabase";

function toOrder(order: { id: string; table_number: string; guest_name: string | null; access_code: string; items: unknown[]; status: string; created_at: string; completed_at: string | null }) {
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

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const order = await markOrderServed(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(toOrder(order));
  } catch (e) {
    console.error("PATCH /api/orders/[id]/complete", e);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
