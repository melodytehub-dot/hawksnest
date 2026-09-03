import Link from "next/link";
import { AGENT } from "@/lib/config";

export const metadata = {
  title: "About",
  description: "About Hawk's Nest — a spacious country-club estate in Port St. Lucie, Florida, booked directly with the owner.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-[var(--ta-bg-tint)]">
        <div className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
          <h1 className="text-3xl font-extrabold text-[var(--ta-black)] md:text-4xl">About Hawk's Nest</h1>
          <p className="mt-3 max-w-2xl text-[var(--ta-muted)]">
            A spacious country-club estate on Florida's Treasure Coast, made for families and groups who want a five-star stay without the crowds.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--ta-black)]">The gem of the Treasure Coast</h2>
            <p className="mt-3 leading-relaxed text-[var(--ta-text)]">
              Hawk's Nest is an independent vacation rental in Southern Port St. Lucie / North Stuart, Florida — a five-bedroom country-club estate with a private pool, hot tub and waterfall, and space to comfortably sleep up to 16.
            </p>
            <p className="mt-3 leading-relaxed text-[var(--ta-text)]">
              We built Hawk's Nest for families and groups: room to gather, space to breathe. Because we're an independent owner, every booking is personal — check your dates and we'll confirm availability and pricing directly, with no platform fees.
            </p>
            <Link href={`${AGENT.bookingRoute}#check`} className="ta-btn ta-btn--primary mt-6">Explore the estate</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat value="5" label="Bedrooms" />
            <Stat value="16" label="Guests" />
            <Stat value="3" label="Bathrooms" />
            <Stat value="Pool" label="Private + hot tub" />
          </div>
        </div>
      </section>

      <section className="bg-[var(--ta-black)]">
        <div className="mx-auto max-w-[1240px] px-4 py-12 text-center md:px-6">
          <p className="text-lg font-medium text-white">A private, resort-style escape — booked directly with the owner.</p>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-[var(--ta-border)] p-5 text-center">
      <div className="text-3xl font-extrabold text-[var(--ta-gold)]">{value}</div>
      <div className="mt-1 text-sm text-[var(--ta-muted)]">{label}</div>
    </div>
  );
}
