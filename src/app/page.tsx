import Link from "next/link";
import Image from "next/image";
import { getListingBySlug, parseAmenities } from "@/lib/data";
import { AGENT } from "@/lib/config";
import { starIcon, pinIcon } from "@/components/site/icons";
import ListingCard from "@/components/listing/ListingCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getListingBySlug(AGENT.listingSlug);
  const l = data?.listing;
  const hero = l?.photos?.find((p) => p.isHero)?.src || "/images/airbnb/g-000.jpg";
  const amenities = l ? parseAmenities(l.amenitiesText) : [];

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[440px] w-full overflow-hidden md:h-[72vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero} alt="Pool and waterfall at Hawk's Nest" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1240px] px-4 pb-10 md:px-6">
              <div className="max-w-2xl">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/80">Vacation Rental · {l?.city || "Port St. Lucie"}, {l?.state || "FL"}</p>
                <h1 className="text-3xl font-extrabold leading-tight text-white md:text-5xl">
                  {l?.title || "Spacious Estate Home with Pool"}
                </h1>
                <p className="mt-3 max-w-xl text-white/90">
                  Country-club estate with a private pool, hot tub and waterfall. Five bedrooms, sleeps {l?.maxGuests || 16} — perfect for families and group getaways.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link href={`${AGENT.bookingRoute}#check`} className="ta-btn ta-btn--primary px-6 py-3">Check availability</Link>
                  <Link href={AGENT.bookingRoute} className="ta-btn ta-btn--outline bg-white/15 px-6 py-3 text-white backdrop-blur">View the estate</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--ta-black)] md:text-3xl">{l?.title}</h2>
            <p className="mt-1 text-sm text-[var(--ta-muted)]">{l?.subtitle}</p>
          </div>
          {l && (
            <div className="text-right">
              <span className="ta-badge-score text-lg">{starIcon({ className: "h-5 w-5" })}{l.rating.toFixed(2)} <span className="text-sm font-normal text-[var(--ta-muted)]">({l.reviewCount} reviews)</span></span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Highlight label="Guests" value={`${l?.maxGuests || 16}`} />
          <Highlight label="Bedrooms" value={`${l?.bedrooms || 5}`} />
          <Highlight label="Bedrooms / baths" value={`${l?.bathrooms || 3} baths`} />
          <Highlight label="Pool" value="Private + hot tub" />
        </div>
      </section>

      {/* Feature band */}
      <section className="bg-[var(--ta-bg-tint)]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-6 px-4 py-14 md:grid-cols-3 md:px-6">
          <Feature title="Roomy for the whole group" body="Five bedrooms and plenty of living space across the estate — gather everyone around the pool or spread out and relax." />
          <Feature title="Private pool, hot tub & waterfall" body="A tropical backyard oasis. Grill out on the outdoor kitchen, unwind in the hot tub, and enjoy the waterfall." />
          <Feature title="Direct with the owner" body="No middlemen or platform fees. Check your dates and the owner confirms availability and pricing personally." />
        </div>
      </section>

      {/* Featured estate */}
      {l && (
        <section className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--ta-muted)]">Latest listing</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--ta-black)] md:text-3xl">Ready to plan your Treasure Coast getaway?</h2>
          </div>
          <div className="mx-auto max-w-[640px]">
            <ListingCard
              listing={{
                slug: l.slug,
                title: l.title,
                subtitle: `Entire home in ${l.city}, ${l.state}`,
                city: l.city,
                state: l.state,
                rating: l.rating,
                reviewCount: l.reviewCount,
                maxGuests: l.maxGuests,
                bedrooms: l.bedrooms,
                bathrooms: l.bathrooms,
                beds: l.beds,
                heroSrc: hero,
                photoCount: l.photos?.length || 0,
              }}
            />
          </div>
        </section>
      )}

      {/* Photo gallery preview */}
      {l && l.photos.length > 8 && (
        <section className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
          <h2 className="mb-6 text-2xl font-extrabold text-[var(--ta-black)] md:text-3xl">Explore the estate</h2>
          <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-2xl md:grid-cols-4">
            {l.photos.slice(1, 9).map((p) => (
              <Link key={p.id} href={AGENT.bookingRoute} className="group relative aspect-square overflow-hidden">
                <Image src={p.src} alt={p.album || "estate photo"} fill sizes="25vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                {p.album && <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-xs font-medium text-white">{p.album}</span>}
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href={AGENT.bookingRoute} className="ta-btn ta-btn--outline">See all {l.photos.length} photos</Link>
          </div>
        </section>
      )}

      {/* Amenities strip */}
      {amenities.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-4 pb-16 md:px-6">
          <h2 className="mb-4 text-xl font-extrabold text-[var(--ta-black)]">What this place offers</h2>
          <div className="flex flex-wrap gap-2">
            {(amenities[0]?.items || []).slice(0, 10).map((a) => (
              <span key={a} className="rounded-lg border border-[var(--ta-border)] px-3 py-1.5 text-sm text-[var(--ta-text)]">{a}</span>
            ))}
          </div>
        </section>
      )}

      {/* Quote band — the gem of the Treasure Coast */}
      <section className="bg-[var(--ta-black)]">
        <div className="mx-auto max-w-[1240px] px-4 py-14 text-center md:px-6">
          <p className="text-2xl font-extrabold text-white md:text-4xl">
            The <span className="text-[var(--ta-gold)]">gem</span> of the Treasure Coast.
          </p>
          <p className="mt-3 text-sm uppercase tracking-wide text-white/60">Hawk's Nest Florida</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--ta-black)]">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-4 px-4 py-14 text-center md:px-6">
          <h2 className="text-2xl font-extrabold text-white md:text-3xl">Plan your Treasure Coast getaway</h2>
          <p className="max-w-xl text-white/90">Check your dates and book directly with the owner — no platform fees, personal confirmation.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href={`${AGENT.bookingRoute}#check`} className="ta-btn bg-white px-7 py-3 text-[var(--ta-black)]">Check availability</Link>
            <Link href="/listings" className="ta-btn ta-btn--outline border-white/60 px-7 py-3 text-white">Browse the estates</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Highlight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--ta-border)] p-4">
      <div className="text-2xl font-extrabold text-[var(--ta-black)]">{value}</div>
      <div className="mt-0.5 text-sm text-[var(--ta-muted)]">{label}</div>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-[var(--ta-black)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--ta-text)]">{body}</p>
    </div>
  );
}
