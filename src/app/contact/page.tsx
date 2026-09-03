import Link from "next/link";
import { SITE, AGENT } from "@/lib/config";

export const metadata = {
  title: "Contact",
  description: "Contact Hawk's Nest — send your dates and questions, and the owner replies personally.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="bg-[var(--ta-bg-tint)]">
        <div className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
          <h1 className="text-3xl font-extrabold text-[var(--ta-black)] md:text-4xl">Contact us</h1>
          <p className="mt-3 max-w-2xl text-[var(--ta-muted)]">
            Questions about dates, guest counts, or what the estate can host? Send a note — the owner replies personally.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <InfoCard label="Email us" value={SITE.ownerEmail} href={`mailto:${SITE.ownerEmail}`} note="The fastest way to check availability for your dates." />
            <InfoCard label="Find the estate" value={SITE.address} note="Southern Port St. Lucie / North Stuart · Treasure Coast" />
            <div className="rounded-xl bg-[var(--ta-bg-tint)] p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--ta-muted)]">Availability</h2>
              <p className="mt-2 text-sm text-[var(--ta-text)]">Check your dates on the estate page — you'll receive a prompt acknowledgment with pricing and next steps.</p>
              <Link href={`${AGENT.bookingRoute}#check`} className="mt-3 inline-block text-sm font-semibold text-[var(--ta-green)] hover:underline">Check availability →</Link>
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-[var(--ta-border)]">
            <iframe
              title="Map of Hawk's Nest Florida"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value, href, note }: { label: string; value: string; href?: string; note?: string }) {
  return (
    <div className="rounded-xl border border-[var(--ta-border)] p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--ta-muted)]">{label}</h2>
      {href ? <a href={href} className="mt-2 block text-lg font-semibold text-[var(--ta-green)] hover:underline">{value}</a> : <p className="mt-2 text-lg font-semibold text-[var(--ta-black)]">{value}</p>}
      {note && <p className="mt-1 text-sm text-[var(--ta-muted)]">{note}</p>}
    </div>
  );
}
