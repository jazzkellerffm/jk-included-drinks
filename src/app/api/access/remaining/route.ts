import { NextResponse } from "next/server";
import { getIncludedDrinksForCode } from "@/lib/access-codes";
import { getTotalDrinkCountForTableAndCode } from "@/lib/orders-supabase";
import { normalizeTableId } from "@/lib/table-id";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessCode = searchParams.get("accessCode");
  const tableNumber = searchParams.get("tableNumber") ?? "";

  if (!accessCode?.trim()) {
    return NextResponse.json(
      { error: "accessCode required" },
      { status: 400 }
    );
  }

  const included = getIncludedDrinksForCode(accessCode);
  if (included === null) {
    return NextResponse.json(
      { error: "Invalid access code" },
      { status: 400 }
    );
  }

  const table = normalizeTableId(tableNumber);
  if (!table) {
    return NextResponse.json({ error: "Invalid table number" }, { status: 400 });
  }
  const code = accessCode.trim().toUpperCase();

  try {
    const alreadyOrdered = await getTotalDrinkCountForTableAndCode(table, code);
    const remaining = Math.max(0, included - alreadyOrdered);

    return NextResponse.json({
      remaining,
      includedDrinksTotal: included,
    });
  } catch (e) {
    console.error("GET /api/access/remaining", e);
    return NextResponse.json(
      { error: "Failed to get remaining" },
      { status: 500 }
    );
  }
}
