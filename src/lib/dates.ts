// Date helpers — pure, timezone-safe for date-only values.

export const DAY = 86_400_000;

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Parse a `YYYY-MM-DD` string into a UTC-noon Date (safe for date-only ops). */
export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISODate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Number of nights between two `YYYY-MM-DD` (checkout - checkin). */
export function nightsBetween(a: string, b: string): number {
  return Math.max(0, Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / DAY));
}

/** Iterate each date `YYYY-MM-DD` from checkIn inclusive to checkOut exclusive. */
export function* eachNight(checkIn: string, checkOut: string): Generator<string> {
  const start = parseISODate(checkIn).getTime();
  const end = parseISODate(checkOut).getTime();
  for (let t = start; t < end; t += DAY) {
    yield toISODate(new Date(t));
  }
}

export function addDays(iso: string, n: number): string {
  return toISODate(new Date(parseISODate(iso).getTime() + n * DAY));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(parseISODate(iso));
}

export function formatShort(iso: string): string {
  const d = parseISODate(iso);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (d.getUTCFullYear() !== new Date().getFullYear()) opts.year = "numeric";
  return new Intl.DateTimeFormat("en-US", opts).format(d);
}

/** Format a minor-currency amount (cents) e.g. 25000 -> "$250.00" */
export function money(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2 }).format(cents / 100);
}
