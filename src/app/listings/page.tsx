import { getListingBySlug } from "@/lib/data";
import { AGENT } from "@/lib/config";
import ListingCard from "@/components/listing/ListingCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Estates | Hawk's Nest Florida",
  description: "Explore the Hawk's Nest estate — a five-bedroom country-club vacation rental on Florida's Treasure Coast, booked directly with the owner.",
};

export default async function ListingsPage() {
  const data = await getListingBySlug(AGENT.listingSlug);
  const l = data?.listing;

  const listing = l
    ? {
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
        heroSrc: l.photos?.find((p) => p.isHero)?.src || l.photos?.[0]?.src || "/images/airbnb/g-000.jpg",
        photoCount: l.photos?.length || 0,
      }
    : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        {listing && (
          <div className="relative h-[44vh] min-h-[380px] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.heroSrc} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </div>
        )}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1240px] px-4 pb-10 md:px-6">
            <div className="max-w-2xl">
              <nav className="mb-3 flex items-center gap-2 text-sm text-white/80" aria-label="Breadcrumb">
                <span className="font-semibold text-white">Home</span>
                <span aria-hidden="true">›</span>
                <span>The Estates</span>
              </nav>
              <h1 className="text-3xl font-extrabold text-white md:text-4xl">The <span className="text-[var(--ta-green-tint)]">Estates</span></h1>
              <p className="mt-2 max-w-xl text-white/90">
                One home, thoughtfully kept, and ready for your group — a five-bedroom country-club estate on Florida's Treasure Coast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="mx-auto max-w-[1240px] px-4 py-14 md:px-6">
        {listing ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ListingCard listing={listing} />
            <div className="flex flex-col justify-center gap-4">
              <h2 className="text-2xl font-extrabold text-[var(--ta-black)] md:text-3xl">The gem of the Treasure Coast</h2>
              <p className="leading-relaxed text-[var(--ta-text)]">
                A country-club estate with five bedrooms, a private pool and hot tub, a waterfall, and room for the whole group. Minutes from pristine beaches and over 50 golf courses.
              </p>
              <ul className="space-y-2 text-sm text-[var(--ta-text)]">
                <li className="flex items-center gap-2"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--ta-green)]" />5 bedrooms · sleeps 16</li>
                <li className="flex items-center gap-2"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--ta-green)]" />Private pool, hot tub &amp; waterfall</li>
                <li className="flex items-center gap-2"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--ta-green)]" />11 minutes to pristine beaches</li>
                <li className="flex items-center gap-2"><span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--ta-green)]" />Booked directly with the owner — no platform fees</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-[var(--ta-muted)]">The estate is coming soon.</p>
        )}
      </section>
    </div>
  );
}
