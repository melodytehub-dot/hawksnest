"use client";

import { useEffect, useMemo, useState } from "react";
import { calendarIcon, guestIcon, checkIcon } from "@/components/site/icons";

interface Props {
  listingId: string;
  listingSlug: string;
  maxGuests: number;
  minNights: number;
  currency: string;
  paymentsEnabled: boolean;
  baseRate: number;
}

interface CalDay {
  iso: string;
  day: number;
  free: boolean;
  today: boolean;
  source: string | null;
}

const DAY = 86_400_000;
const parseISO = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const iso = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
const money = (c: number, cur: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: cur, minimumFractionDigits: 2 }).format(c / 100);

interface Quote {
  nights: number;
  nightly: number;
  nightlyTotal: number;
  subtotal: number;
  taxes: number;
  fees: { label: string; amount: number }[];
  total: number;
}

export default function BookingCard({ listingId, listingSlug, maxGuests, minNights, currency, paymentsEnabled, baseRate }: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [picking, setPicking] = useState(false);
  const [calendar, setCalendar] = useState<CalDay[]>([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteErr, setQuoteErr] = useState("");

  const today = useMemo(() => { const n = new Date(); return iso(n); }, []);

  useEffect(() => {
    loadMonth(monthOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthOffset]);

  async function loadMonth(offset: number) {
    const base = new Date();
    const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    const mp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    setLoadingMonth(true);
    try {
      const res = await fetch(`/api/availability?month=${mp}`);
      if (res.ok) {
        const data = await res.json();
        setCalendar(data.days);
      }
    } finally {
      setLoadingMonth(false);
    }
  }

  // Weekly rows for the current month
  const weeks = useMemo(() => {
    const first = new Date();
    const start = new Date(first.getFullYear(), first.getMonth() + monthOffset, 1);
    const pad = start.getDay();
    const rows: (CalDay | null)[] = [];
    for (let i = 0; i < pad; i++) rows.push(null);
    for (const c of calendar) rows.push(c);
    while (rows.length % 7 !== 0) rows.push(null);
    const out: (CalDay | null)[][] = [];
    for (let i = 0; i < rows.length; i += 7) out.push(rows.slice(i, i + 7));
    return out;
  }, [calendar, monthOffset]);

  function pickDate(day: CalDay | null) {
    if (!day || !day.free) return;
    if (day.iso < today) return;

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day.iso);
      setCheckOut("");
      setQuote(null);
      setQuoteErr("");
    } else if (day.iso > checkIn) {
      setCheckOut(day.iso);
    } else {
      setCheckIn(day.iso);
      setCheckOut("");
    }
  }

  async function requestQuote() {
    if (!checkIn || !checkOut) { setQuoteErr("Select your check-in and check-out dates."); setQuote(null); return; }
    setQuoteErr("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut, guests }),
      });
      const data = await res.json();
      if (!res.ok) { setQuoteErr(data.error || "Something went wrong."); setQuote(null); return; }
      setQuote(data);
    } catch {
      setQuoteErr("Couldn't reach the server. Try again.");
      setQuote(null);
    }
  }

  function submit() {
    if (!checkIn || !checkOut) { setQuoteErr("Select your dates first."); return; }
    const qp = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    window.location.href = `/book?${qp.toString()}`;
  }

  const nights = checkIn && checkOut ? Math.max(0, Math.round((parseISO(checkOut).getTime() - parseISO(checkIn).getTime()) / DAY)) : 0;

  return (
    <div className="rounded-2xl border border-[var(--ta-border)] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div>
          <div className="text-[13px] text-[var(--ta-muted)]">Entire home</div>
          <div className="text-lg font-extrabold text-[var(--ta-black)]">Check availability</div>
        </div>
      </div>

      <button
        className="flex w-full items-center gap-3 rounded-xl border border-[var(--ta-border)] px-4 py-3 text-left hover:bg-[var(--ta-bg-tint)]"
        onClick={() => setPicking((v) => !v)}
        aria-expanded={picking}
      >
        <span className="text-[var(--ta-gold)]">{calendarIcon}</span>
        <div className="flex-1">
          <div className="text-xs font-medium text-[var(--ta-muted)]">Dates</div>
          <div className="text-sm font-semibold">
            {checkIn && checkOut ? `${fmt(checkIn)} → ${fmt(checkOut)}` : "Add dates"}
            {nights > 0 && <span className="ml-2 text-[var(--ta-muted)] font-normal">· {nights} night{nights > 1 ? "s" : ""}</span>}
          </div>
        </div>
        <span className="text-[var(--ta-muted)]">{picking ? "−" : "+"}</span>
      </button>

      {picking && (
        <div className="mt-3 rounded-xl border border-[var(--ta-border)] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Select dates</span>
            <div className="flex gap-1">
              <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-[var(--ta-bg-soft)] disabled:opacity-30" onClick={() => setMonthOffset((m) => Math.max(0, m - 1))} disabled={monthOffset === 0} aria-label="Previous month">‹</button>
              <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-[var(--ta-bg-soft)]" onClick={() => setMonthOffset((m) => m + 1)} aria-label="Next month">›</button>
            </div>
          </div>
          <div className="mb-2 text-center text-sm font-bold">{monthLabel(monthOffset)}</div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="py-1 text-[var(--ta-muted)]">{d}</div>
            ))}
            {weeks.flat().map((c, i) =>
              c === null ? (
                <div key={`pad-${i}`} />
              ) : (
                <button
                  key={c.iso}
                  disabled={!c.free || c.iso < today}
                  onClick={() => pickDate(c)}
                  className={`flex h-9 items-center justify-center rounded-lg text-sm transition
                    ${c.iso === checkIn ? "bg-[var(--ta-green)] text-white font-bold"
                    : c.iso === checkOut ? "bg-[var(--ta-green)] text-white font-bold"
                    : (c.iso > checkIn && (checkIn && !checkOut) && c.iso <= checkOut) ? "bg-[var(--ta-green-soft)]"
                    : !c.free ? "cursor-not-allowed text-[var(--ta-muted)] line-through"
                    : "hover:bg-[var(--ta-bg-soft)]"}`}
                >
                  {c.day}
                </button>
              )
            )}
          </div>
        </div>
      )}

      <div className="mt-3 flex w-full items-center gap-3 rounded-xl border border-[var(--ta-border)] px-4 py-3">
        <span className="text-[var(--ta-gold)]">{guestIcon}</span>
        <div className="flex-1">
          <div className="text-xs font-medium text-[var(--ta-muted)]">Guests</div>
          <div className="text-sm font-semibold">{guests} guest{guests > 1 ? "s" : ""}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-7 w-7 items-center justify-center rounded-full border hover:bg-[var(--ta-bg-soft)] disabled:opacity-30" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1} aria-label="Fewer guests">−</button>
          <button className="flex h-7 w-7 items-center justify-center rounded-full border hover:bg-[var(--ta-bg-soft)] disabled:opacity-30" onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))} disabled={guests >= maxGuests} aria-label="More guests">+</button>
        </div>
      </div>

      <div className="mt-3 text-xs text-[var(--ta-muted)]">
        {minNights > 1 && <span>· {minNights}-night minimum</span>}
        <span> · Up to {maxGuests} guests</span>
      </div>

      {nights > 0 && (
        <button className="ta-btn ta-btn--outline mt-3 w-full" onClick={requestQuote} type="button">View price quote</button>
      )}
      {quoteErr && <div className="mt-2 text-xs font-medium text-[var(--ta-red)]">{quoteErr}</div>}

      {quote && (
        <div className="mt-3 rounded-xl bg-[var(--ta-bg-tint)] p-3 text-sm">
          <div className="flex justify-between"><span className="text-[var(--ta-muted)]">{fmtPrice(quote.nightly, currency)} × {quote.nights} night{quote.nights > 1 ? "s" : ""}</span><span>{money(quote.nightlyTotal, currency)}</span></div>
          {quote.fees.map((f) => (
            <div key={f.label} className="mt-1 flex justify-between"><span className="text-[var(--ta-muted)]">{f.label}</span><span>{money(f.amount, currency)}</span></div>
          ))}
          <div className="mt-1 flex justify-between text-[var(--ta-muted)]"><span>Taxes</span><span>{money(quote.taxes, currency)}</span></div>
          <div className="mt-2 flex justify-between border-t border-[var(--ta-border)] pt-2 font-bold"><span>Total</span><span className="text-[var(--ta-gold)]">{money(quote.total, currency)}</span></div>
        </div>
      )}

      <button className="ta-btn ta-btn--primary mt-4 w-full" type="button" onClick={submit}>
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/25">{checkIcon}</span>
        {paymentsEnabled ? "Book now" : "Request to book"}
      </button>
      <p className="mt-2 text-center text-xs text-[var(--ta-muted)]">
        {paymentsEnabled ? "Secure checkout with Stripe" : "You'll confirm details with the owner — no payment now."}
      </p>
    </div>
  );
}

function fmt(iso: string): string {
  const d = parseISO(iso);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}
function monthLabel(offset: number): string {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(d);
}
function fmtPrice(cents: number, cur: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(cents / 100);
}
