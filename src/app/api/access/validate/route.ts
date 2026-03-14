import { NextResponse } from "next/server";
import { getIncludedDrinksForCode } from "@/lib/access-codes";
import { getTotalDrinkCountForTableAndCode } from "@/lib/orders-supabase";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { tableNumber, accessCode } = body as {
    tableNumber?: string;
    accessCode?: string;
  };

  if (!accessCode?.trim()) {
    return NextResponse.json(
      { valid: false, error: "Access code required" },
      { status: 400 }
    );
  }

  const included = getIncludedDrinksForCode(accessCode);
  if (included === null) {
    return NextResponse.json(
      { valid: false, error: "Invalid access code" },
      { status: 200 }
    );
  }

  const table = (tableNumber ?? "").trim();
  const code = accessCode.trim().toUpperCase();

  try {
    const alreadyOrdered = await getTotalDrinkCountForTableAndCode(table, code);
    const remaining = Math.max(0, included - alreadyOrdered);

    return NextResponse.json({
      valid: true,
      tableNumber: table,
      includedDrinksTotal: included,
      remaining,
    });
  } catch (e) {
    console.error("POST /api/access/validate", e);
    return NextResponse.json(
      { valid: false, error: "Could not validate" },
      { status: 500 }
    );
  }
}
