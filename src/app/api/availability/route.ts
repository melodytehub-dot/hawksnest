import { NextRequest, NextResponse } from "next/server";
import { getListingBySlug, getListingAvailability } from "@/lib/data";
import { monthGrid } from "@/lib/availability";
import { toISODate } from "@/lib/dates";

const SLUG = process.env.LISTING_SLUG || "spacious-estate-home-country-club-pool";

/** GET /api/availability?month=2026-09 (optional). Returns calendar state. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get("month");
  const now = new Date();
  const year = monthParam ? parseInt(monthParam.slice(0, 4), 10) : now.getFullYear();
  const month = monthParam ? parseInt(monthParam.slice(5, 7), 10) - 1 : now.getMonth();

  const data = await getListingBySlug(SLUG);
  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });

  const avail = await getListingAvailability(data.listing.id);
  const grid = monthGrid(new Date(year, month, 1), avail);
  const today = toISODate(new Date());

  const days = grid.cells
    .filter((c) => c.inMonth)
    .map((c) => ({
      iso: c.iso,
      day: c.day,
      free: c.free,
      today: c.today,
      source: c.source || null,
    }));

  return NextResponse.json({ month: grid.monthLabel, today, days });
}
