import { prisma } from "./prisma";
import { buildAvailability, type BlockedNight } from "./availability";
import type { RateWindow } from "./pricing";
import { toISODate } from "./dates";

export type ListingWithRelations = Awaited<ReturnType<typeof getListingBySlug>>;

/** Blocked nights come from calendar blocks (synced/manual) + confirmed bookings. */
export async function getBlockedNights(listingId: string): Promise<BlockedNight[]> {
  const now = toISODate(new Date());
  const [blocks, bookings] = await Promise.all([
    prisma.calendarBlock.findMany({
      where: { listingId, date: { gte: new Date(`${now}T00:00:00Z`) } },
      select: { date: true, source: true },
    }),
    prisma.booking.findMany({
      where: { listingId, status: { in: ["confirmed", "pending"] }, checkOut: { gt: new Date(`${now}T00:00:00Z`) } },
      select: { checkIn: true, checkOut: true },
    }),
  ]);

  const out: BlockedNight[] = blocks.map((b) => ({ date: toISODate(b.date), source: b.source || "manual" }));

  for (const bk of bookings) {
    const start = new Date(`${toISODate(bk.checkIn)}T12:00:00Z`).getTime();
    const end = new Date(`${toISODate(bk.checkOut)}T12:00:00Z`).getTime();
    for (let t = start; t < end; t += 86_400_000) {
      out.push({ date: toISODate(new Date(t)), source: "direct" });
    }
  }

  // dedupe by date (first wins; prefer explicit blocks over derived)
  const seen = new Map<string, BlockedNight>();
  for (const b of out) if (!seen.has(b.date)) seen.set(b.date, b);
  return [...seen.values()];
}

export async function getListingAvailability(listingId: string) {
  const blocked = await getBlockedNights(listingId);
  return buildAvailability(blocked);
}

export async function getListingBySlug(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      photos: { orderBy: { order: "asc" } },
      rooms: { orderBy: { sort: "asc" } },
      rates: { orderBy: { startDate: "asc" } },
    },
  });
  if (!listing) return null;

  const rateOverrides: RateWindow[] = listing.rates.map((r) => ({
    startDate: r.startDate,
    endDate: r.endDate,
    nightly: r.nightly,
    minNights: r.minNights,
  }));

  return { listing: { ...listing, rateOverrides } };
}

export function parseAmenities(json: string): { group: string; items: string[] }[] {
  try {
    const v = JSON.parse(json);
    if (Array.isArray(v)) return v;
    return [];
  } catch {
    return [];
  }
}
