import Link from "next/link";
import { AGENT, SITE } from "@/lib/config";

export default function Footer() {
  const y = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--ta-border-soft)] bg-white">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="mb-3 text-xl font-extrabold text-[var(--ta-green)]">Hawk's Nest</div>
          <p className="text-sm leading-relaxed text-[var(--ta-muted)]">
            Spacious country-club estate home on Florida's Treasure Coast. Private pool, hot tub, waterfall and
            room for the whole group — booked directly with the owner.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--ta-black)]">Explore</h4>
          <ul className="space-y-2 text-sm text-[var(--ta-text)]">
            <li><Link href="/" className="hover:text-[var(--ta-green)]">Home</Link></li>
            <li><Link href="/listings" className="hover:text-[var(--ta-green)]">The Estates</Link></li>
            <li><Link href={AGENT.bookingRoute} className="hover:text-[var(--ta-green)]">The Estate</Link></li>
            <li><Link href="/about" className="hover:text-[var(--ta-green)]">About</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--ta-green)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--ta-black)]">The Estate</h4>
          <ul className="space-y-2 text-sm text-[var(--ta-text)]">
            <li>5 bedrooms · sleeps 16</li>
            <li>Private pool &amp; hot tub</li>
            <li>3 full bathrooms</li>
            <li><Link href={`${AGENT.bookingRoute}#check`} className="font-semibold text-[var(--ta-green)] hover:underline">Check availability</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--ta-black)]">Contact</h4>
          <ul className="space-y-2 text-sm text-[var(--ta-text)]">
            <li>{SITE.address}</li>
            <li className="break-all">
              <a href={`mailto:${SITE.ownerEmail}`} className="text-[var(--ta-green)] hover:underline">{SITE.ownerEmail}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--ta-border-soft)]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-[var(--ta-muted)] sm:flex-row md:px-6">
          <span>© {y} Hawk's Nest · Port St. Lucie, FL</span>
          <span>Booked directly with the owner · no platform fees</span>
        </div>
      </div>
    </footer>
  );
}
