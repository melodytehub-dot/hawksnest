import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getListingBySlug } from "@/lib/data";
import { AGENT } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getListingBySlug(AGENT.listingSlug);
  const listingId = data?.listing.id || "";

  const [bookings, requests, materials, syncLogs] = await Promise.all([
    listingId ? prisma.booking.findMany({ where: { listingId }, orderBy: { createdAt: "desc" }, take: 50 }) : Promise.resolve([]),
    listingId ? prisma.bookingRequest.findMany({ where: { listingId }, orderBy: { createdAt: "desc" }, take: 50 }) : Promise.resolve([]),
    prisma.material.findMany({ orderBy: { sort: "asc" } }),
    listingId ? prisma.syncLog.findMany({ where: { listingId }, orderBy: { createdAt: "desc" }, take: 10 }) : Promise.resolve([]),
  ]);

  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const newReqs = requests.filter((r) => r.status === "new").length;
  const materialsDone = materials.filter((m) => m.done).length;
  const lastSync = syncLogs[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Confirmed bookings" value={String(confirmed)} />
        <Stat label="Pending bookings" value={String(pending)} />
        <Stat label="New availability requests" value={String(newReqs)} />
        <Stat label="Materials ready" value={`${materialsDone}/${materials.length}`} />
      </div>

      <div className="rounded-2xl border border-[var(--ta-border)] bg-white p-6">
        <h2 className="text-lg font-bold text-[var(--ta-black)]">Setup checklist</h2>
        <p className="mt-1 text-sm text-[var(--ta-muted)]">Items from the project agreement. The site runs on defaults until these are ready.</p>
        <ul className="mt-4 space-y-2">
          {materials.map((m) => (
            <li key={m.key} className="flex items-start gap-3 rounded-lg border border-[var(--ta-border-soft)] px-3 py-2">
              <span className={`mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-xs ${m.done ? "bg-[var(--ta-green)] text-white" : "border border-[var(--ta-border)]"}`}>
                {m.done ? "✓" : ""}
              </span>
              <div>
                <div className="text-sm font-semibold">{m.label}</div>
                {m.note && <div className="text-xs text-[var(--ta-muted)]">{m.note}</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {lastSync && (
        <p className="text-sm text-[var(--ta-muted)]">
          Last calendar sync: {lastSync.provider} · {lastSync.status} · {lastSync.events} events · {lastSync.createdAt.toLocaleString()}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link href="/dashboard/bookings" className="rounded-2xl border border-[var(--ta-border)] bg-white p-6 hover:shadow-sm">
          <h3 className="font-bold text-[var(--ta-black)]">Bookings</h3>
          <p className="mt-1 text-sm text-[var(--ta-muted)]">Manage confirmed &amp; requested stays</p>
        </Link>
        <Link href="/dashboard/calendar" className="rounded-2xl border border-[var(--ta-border)] bg-white p-6 hover:shadow-sm">
          <h3 className="font-bold text-[var(--ta-black)]">Calendar</h3>
          <p className="mt-1 text-sm text-[var(--ta-muted)]">See availability &amp; block dates</p>
        </Link>
        <Link href="/dashboard/rates" className="rounded-2xl border border-[var(--ta-border)] bg-white p-6 hover:shadow-sm">
          <h3 className="font-bold text-[var(--ta-black)]">Rates</h3>
          <p className="mt-1 text-sm text-[var(--ta-muted)]">Seasonal pricing &amp; fees</p>
        </Link>
        <Link href="/dashboard/listing" className="rounded-2xl border border-[var(--ta-border)] bg-white p-6 hover:shadow-sm">
          <h3 className="font-bold text-[var(--ta-black)]">Listing</h3>
          <p className="mt-1 text-sm text-[var(--ta-muted)]">Edit the estate details</p>
        </Link>
        <Link href="/dashboard/sync" className="rounded-2xl border border-[var(--ta-border)] bg-white p-6 hover:shadow-sm">
          <h3 className="font-bold text-[var(--ta-black)]">Calendar sync</h3>
          <p className="mt-1 text-sm text-[var(--ta-muted)]">Airbnb &amp; Vrbo iCal sources</p>
        </Link>
        <Link href="/dashboard/materials" className="rounded-2xl border border-[var(--ta-border)] bg-white p-6 hover:shadow-sm">
          <h3 className="font-bold text-[var(--ta-black)]">Materials</h3>
          <p className="mt-1 text-sm text-[var(--ta-muted)]">Project checklist</p>
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--ta-border)] bg-white p-6">
      <div className="text-3xl font-extrabold text-[var(--ta-green)]">{value}</div>
      <div className="mt-1 text-sm text-[var(--ta-muted)]">{label}</div>
    </div>
  );
}
