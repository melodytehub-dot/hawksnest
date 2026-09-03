import { eachNight, nightsBetween } from "./dates";

export interface RateWindow {
  startDate: Date;   // YYYY-MM-DD semantics (UTC noon)
  endDate: Date;     // inclusive
  nightly: number;   // cents
  minNights?: number | null;
}

export interface PricingInput {
  listing: {
    baseRate: number;       // cents/night
    cleaningFee: number;    // cents
    petFee: number;         // cents
    taxRatePct: number;     // e.g. 12.5
    minNights: number;
    maxNights?: number | null;
  };
  rateOverrides: RateWindow[];
}

export interface FeeLine {
  key: string;
  label: string;
  amount: number; // cents
}

export interface PricingResult {
  nights: number;
  nightly: number;        // cents
  nightlyTotal: number;   // cents
  fees: FeeLine[];
  subtotal: number;       // cents (nightlyTotal + fees)
  taxes: number;          // cents
  total: number;          // cents
  minNights: number;
}

export type QuoteError = { error: string };

function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toDateOnly(d: Date): string {
  const yy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function quoteStay(checkIn: string, checkOut: string, input: PricingInput): PricingResult | QuoteError {
  const nights = nightsBetween(checkIn, checkOut);
  const { listing } = input;
  if (nights <= 0) return { error: "Check-out must be after check-in." };
  if (listing.minNights > 0 && nights < listing.minNights)
    return { error: `Minimum stay is ${listing.minNights} night${listing.minNights > 1 ? "s" : ""}.` };
  if (listing.maxNights && nights > listing.maxNights)
    return { error: `Maximum stay is ${listing.maxNights} nights.` };

  const perNight: number[] = [];
  for (const iso of eachNight(checkIn, checkOut)) {
    const d = parseDateOnly(iso);
    const match = input.rateOverrides.find(
      (o) => d >= parseDateOnly(toDateOnly(o.startDate)) && d <= parseDateOnly(toDateOnly(o.endDate))
    );
    perNight.push(match ? match.nightly : listing.baseRate);
  }

  const nightlyTotal = perNight.reduce((a, b) => a + b, 0);
  const uniform = perNight.every((v) => v === perNight[0]);
  const nightly = uniform ? perNight[0] : Math.round(nightlyTotal / nights);

  const fees: FeeLine[] = [];
  if (listing.cleaningFee > 0) fees.push({ key: "cleaning", label: "Cleaning fee", amount: listing.cleaningFee });
  if (listing.petFee > 0) fees.push({ key: "pet", label: "Pet fee", amount: listing.petFee });

  const subtotal = nightlyTotal + fees.reduce((a, f) => a + f.amount, 0);
  const taxes = Math.round((subtotal * listing.taxRatePct) / 100);
  const total = subtotal + taxes;

  return { nights, nightly, nightlyTotal, fees, subtotal, taxes, total, minNights: listing.minNights };
}
