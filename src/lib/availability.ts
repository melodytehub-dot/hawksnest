import { eachNight, toISODate, addDays } from "./dates";

export interface BlockedNight {
  date: string;   // YYYY-MM-DD
  source: string; // manual | airbnb | vrbo | owner
}

export interface AvailabilityState {
  /** All blocked nights as a map (date -> detail). */
  blocked: Map<string, BlockedNight>;
  isNightFree(iso: string): boolean;
  isStayFree(checkIn: string, checkOut: string): { free: boolean; blockedIso?: string; source?: string };
}

export function buildAvailability(blocked: BlockedNight[]): AvailabilityState {
  const map = new Map<string, BlockedNight>();
  for (const b of blocked) map.set(b.date, b);

  const isNightFree = (iso: string) => !map.has(iso);

  const isStayFree = (checkIn: string, checkOut: string) => {
    for (const iso of eachNight(checkIn, checkOut)) {
      const b = map.get(iso);
      if (b) return { free: false, blockedIso: iso, source: b.source };
    }
    return { free: true };
  };

  return { blocked: map, isNightFree, isStayFree };
}

// Month calendar widget scaffolding.
export interface DayCell {
  iso: string;
  day: number;
  isFuture: boolean;
  free: boolean;
  today: boolean;
  inMonth: boolean; // false for leading/trailing padding cells
  source?: string;
}

export function monthGrid(monthDate: Date, avail: AvailabilityState): { cells: DayCell[]; monthLabel: string } {
  const y = monthDate.getFullYear();
  const m = monthDate.getMonth();
  const startPad = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells: DayCell[] = [];
  const todayStr = toISODate(new Date());

  for (let i = 0; i < startPad; i++) {
    cells.push({ iso: "", day: 0, isFuture: false, free: false, today: false, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toISODate(new Date(y, m, d));
    const b = avail.blocked.get(iso);
    const isFuture = iso >= todayStr;
    cells.push({
      iso,
      day: d,
      isFuture,
      free: isFuture && !b,
      today: iso === todayStr,
      inMonth: true,
      source: b?.source,
    });
  }

  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(y, m, 1));
  return { cells, monthLabel };
}

// Convenience: build a snapshot of blocked ISO strings for a wide future window.
export function blockedIsoSet(avail: AvailabilityState, from: string, days = 730): Set<string> {
  const out = new Set<string>();
  for (const iso of eachNight(from, addDays(from, days))) {
    if (avail.blocked.has(iso)) out.add(iso);
  }
  return out;
}
