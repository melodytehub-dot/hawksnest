"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function BookInner() {
  const params = useSearchParams();
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = params.get("guests") || "2";

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [quote, setQuote] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    (async () => {
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkIn, checkOut, guests: Number(guests) }),
        });
        const data = await res.json();
        if (res.ok) setQuote(data);
        else setErr(data.error || "");
      } catch {
        setErr("Couldn't load your quote. Refresh and try again.");
      }
    })();
  }, [checkIn, checkOut, guests]);

  const set = (k: keyof typeof form) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    setStatus("loading");
    setErr("");
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut, guests: Number(guests), ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Something went wrong."); setStatus("error"); return; }
      setPaymentsEnabled(data.paymentsEnabled);
      setStatus("done");
    } catch {
      setErr("Network error. Please try again.");
      setStatus("error");
    }
  }

  const fmt = (isoStr: string) => {
    if (!isoStr) return "";
    const [y, m, d] = isoStr.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(Date.UTC(y, m - 1, d)));
  };

  if (!checkIn || !checkOut) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">Select your dates</h1>
        <p className="mt-2 text-[var(--ta-muted)]">Pick your check-in and check-out dates to start booking.</p>
        <Link href="/stay/spacious-estate-home-country-club-pool#check" className="ta-btn ta-btn--primary mt-6">Choose dates</Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ta-gold-soft)] text-2xl text-[var(--ta-gold-deep)]">✓</div>
        <h1 className="text-2xl font-extrabold">{paymentsEnabled ? "Request received" : "Request sent"}</h1>
        <p className="mt-3 text-[var(--ta-muted)]">
          Thanks, {form.name.split(" ")[0] || "there"}! We have your request for{" "}
          <strong className="text-[var(--ta-text)]">{fmt(checkIn)} → {fmt(checkOut)}</strong> ({quote?.nights ?? ""} nights).
          {paymentsEnabled ? " We'll confirm availability and next steps shortly." : " The owner will confirm availability and pricing personally — no payment is taken now."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="ta-btn ta-btn--outline">Back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <h1 className="text-2xl font-extrabold text-[var(--ta-black)] md:text-3xl">Confirm your booking request</h1>
      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[1fr_340px]">
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold" htmlFor="name">Full name</label>
              <input id="name" className="w-full rounded-lg border border-[var(--ta-border)] px-3 py-2.5 text-sm focus:border-[var(--ta-gold)] focus:outline-none" value={form.name} onChange={set("name")} placeholder="Your name" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold" htmlFor="email">Email</label>
              <input id="email" type="email" className="w-full rounded-lg border border-[var(--ta-border)] px-3 py-2.5 text-sm focus:border-[var(--ta-gold)] focus:outline-none" value={form.email} onChange={set("email")} placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold" htmlFor="phone">Phone (optional)</label>
              <input id="phone" className="w-full rounded-lg border border-[var(--ta-border)] px-3 py-2.5 text-sm focus:border-[var(--ta-gold)] focus:outline-none" value={form.phone} onChange={set("phone")} placeholder="+1 555 555 5555" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold" htmlFor="message">Anything we should know?</label>
              <textarea id="message" rows={3} className="w-full rounded-lg border border-[var(--ta-border)] px-3 py-2.5 text-sm focus:border-[var(--ta-gold)] focus:outline-none" value={form.message} onChange={set("message")} placeholder="Trip type, special occasions, questions…" />
            </div>
          </div>
          {err && <div className="mt-4 text-sm font-medium text-[var(--ta-red)]">{err}</div>}
          <button className="ta-btn ta-btn--primary mt-6" onClick={submit} disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Send booking request"}
          </button>
          <p className="mt-2 text-xs text-[var(--ta-muted)]">No payment is taken now — the owner confirms availability directly.</p>
        </div>

        <aside className="rounded-2xl border border-[var(--ta-border)] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--ta-muted)]">Your stay</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--ta-muted)]">Check-in</dt><dd className="font-semibold">{fmt(checkIn)}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--ta-muted)]">Check-out</dt><dd className="font-semibold">{fmt(checkOut)}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--ta-muted)]">Nights</dt><dd className="font-semibold">{quote?.nights ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--ta-muted)]">Guests</dt><dd className="font-semibold">{guests}</dd></div>
          </dl>
          {quote && (
            <div className="mt-4 border-t border-[var(--ta-border-soft)] pt-4 text-sm">
              {quote.fees?.map((f: any) => (
                <div key={f.label} className="flex justify-between text-[var(--ta-muted)]"><span>{f.label}</span><span>{money(f.amount)}</span></div>
              ))}
              <div className="mt-1 flex justify-between text-[var(--ta-muted)]"><span>Taxes</span><span>{money(quote.taxes)}</span></div>
              <div className="mt-2 flex justify-between font-bold"><span>Total</span><span className="text-[var(--ta-gold)]">{money(quote.total)}</span></div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format((cents || 0) / 100);
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-20 text-center">Loading your booking…</div>}>
      <BookInner />
    </Suspense>
  );
}
