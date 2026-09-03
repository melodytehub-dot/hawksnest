import { NextRequest, NextResponse } from "next/server";
import { getListingBySlug, getListingAvailability } from "@/lib/data";
import { quoteStay } from "@/lib/pricing";
import { nightsBetween, todayISO } from "@/lib/dates";

const SLUG = process.env.LISTING_SLUG || "spacious-estate-home-country-club-pool";

/** POST /api/quote { checkIn, checkOut, guests } -> pricing + availability check. */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const checkIn: string | undefined = body?.checkIn;
  const checkOut: string | undefined = body?.checkOut;

  if (!checkIn || !checkOut) return NextResponse.json({ error: "Select check-in and check-out dates." }, { status: 400 });

  const today = todayISO();
  if (checkIn < today) return NextResponse.json({ error: "Check-in can't be in the past." }, { status: 400 });
  if (checkOut <= checkIn) return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });

  const nights = nightsBetween(checkIn, checkOut);

  const data = await getListingBySlug(SLUG);
  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });

  const avail = await getListingAvailability(data.listing.id);
  const stay = avail.isStayFree(checkIn, checkOut);
  if (!stay.free) {
    return NextResponse.json(
      { error: `Some of your dates are unavailable (${stay.blockedIso}). Try different dates.` },
      { status: 409 }
    );
  }

  const monthsOut = Math.ceil(nights / 30) + 1;
  const res = quoteStay(checkIn, checkOut, {
    listing: {
      baseRate: data.listing.baseRate,
      cleaningFee: data.listing.cleaningFee,
      petFee: data.listing.petFee,
      taxRatePct: data.listing.taxRatePct,
      minNights: data.listing.minNights,
      maxNights: data.listing.maxNights,
    },
    rateOverrides: data.listing.rateOverrides,
  });

  if ("error" in res) return NextResponse.json({ error: res.error }, { status: 422 });

  return NextResponse.json({
    checkIn,
    checkOut,
    currency: data.listing.currency,
    ...res,
  });
}
