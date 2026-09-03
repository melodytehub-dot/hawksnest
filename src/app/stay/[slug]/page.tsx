import { notFound } from "next/navigation";
import { getListingBySlug, getListingAvailability, parseAmenities } from "@/lib/data";
import { SITE, AGENT } from "@/lib/config";
import { getPaymentsConfig } from "@/lib/config";
import PhotoMosaic from "@/components/stay/PhotoMosaic";
import BookingCard from "@/components/stay/BookingCard";
import { starIcon, pinIcon, ownerCircle } from "@/components/site/icons";

export const dynamic = "force-dynamic";

const slugDefault = AGENT.listingSlug;

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getListingBySlug(slug);
  if (!data || !data.listing) notFound();

  const l = data.listing;
  const avail = await getListingAvailability(l.id);
  const payments = getPaymentsConfig();
  const amenities = parseAmenities(l.amenitiesText);
  const allPhotos = l.photos.filter((p) => !p.isHero).length > 1 ? l.photos : l.photos;
  const hero = allPhotos.slice(0, 5);
  const rest = allPhotos.slice(5);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1240px] px-4 pt-4 text-sm text-[var(--ta-muted)] md:px-6">
        <span className="text-[var(--ta-green)]">Vacation Rentals</span>
        <span className="mx-1.5">›</span>
        <span>{l.city}</span>
        <span className="mx-1.5">›</span>
        <span className="font-semibold text-[var(--ta-text)]">{l.title}</span>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 md:px-6">
        {/* Title row */}
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--ta-black)] md:text-3xl">{l.title}</h1>
            <p className="mt-1 text-sm text-[var(--ta-muted)]">
              {l.subtitle} · {l.address}
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="ta-badge-score">
                {starIcon({ className: "h-4 w-4" })}
                {l.rating.toFixed(2)}
                <span className="font-normal text-[var(--ta-muted)]">({l.reviewCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1 text-[var(--ta-muted)]"><span className="text-[var(--ta-green)]">{pinIcon}</span>{l.city}, {l.state}</span>
            </div>
          </div>
        </div>

        {/* Mosaic gallery */}
        <div className="mt-4">
          <PhotoMosaic photos={hero} listingTitle={l.title} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main column */}
          <div className="min-w-0">
            {/* Quick facts */}
            <div className="flex flex-wrap gap-2 border-y border-[var(--ta-border-soft)] py-4 text-sm">
              <span className="rounded-lg bg-[var(--ta-bg-soft)] px-3 py-1.5 font-semibold">{l.maxGuests} guests</span>
              <span className="rounded-lg bg-[var(--ta-bg-soft)] px-3 py-1.5 font-semibold">{l.bedrooms} bedrooms</span>
              <span className="rounded-lg bg-[var(--ta-bg-soft)] px-3 py-1.5 font-semibold">{l.bathrooms} bathrooms</span>
              <span className="rounded-lg bg-[var(--ta-bg-soft)] px-3 py-1.5 font-semibold">{l.beds} beds</span>
              <span className="rounded-lg bg-[var(--ta-bg-soft)] px-3 py-1.5 font-semibold">Pool &amp; hot tub</span>
            </div>

            {/* About */}
            <section className="mt-6">
              <h2 className="text-xl font-extrabold text-[var(--ta-black)]">About this home</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-[var(--ta-text)]">{l.description}</p>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-[var(--ta-text)]">{l.longDescription}</p>
            </section>

            {/* Sleeps */}
            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-[var(--ta-black)]">Where you&apos;ll sleep</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(l.rooms || []).map((room) => (
                  <div key={room.id} className="rounded-xl border border-[var(--ta-border)] p-4">
                    {room.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={room.photo} alt={room.name} className="mb-3 h-28 w-full rounded-lg object-cover" />
                    ) : null}
                    <div className="text-sm font-bold text-[var(--ta-black)]">{room.name}</div>
                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--ta-muted)]">
                      {(room.beds as unknown as { name?: string; count?: number }[] | null)?.map((b, i) => (
                        <span key={i} className="inline-flex items-center gap-1">
                          {b.count && b.count > 1 ? `${b.count}× ` : ""}{b.name || "bed"}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-[var(--ta-black)]">What this place offers</h2>
              <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                {amenities.map((group, gi) => (
                  <div key={gi}>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--ta-muted)]">{group.group}</h3>
                    <ul className="mt-2 grid grid-cols-1 gap-1.5 text-sm text-[var(--ta-text)]">
                      {group.items.slice(0, 12).map((item, ii) => (
                        <li key={ii} className="flex items-start gap-2">
                          <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--ta-green)]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Policies/house rules */}
            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-[var(--ta-black)]">Good to know</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-[var(--ta-text)]">
                <li className="flex items-center gap-2"><span className="text-[var(--ta-green)]">{ownerCircle()}</span>{l.maxGuests} guests max · quiet residential area</li>
                <li className="flex items-center gap-2"><span className="text-[var(--ta-red)]">•</span>NO LOUD PARTIES — we respect our neighbors.</li>
                <li className="flex items-center gap-2"><span className="text-[var(--ta-green)]">•</span>Whole home yours, except the garage.</li>
                <li className="flex items-center gap-2"><span className="text-[var(--ta-green)]">•</span>Self check-in · free parking on premises.</li>
              </ul>
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingCard
              listingId={l.id}
              listingSlug={l.slug}
              maxGuests={l.maxGuests}
              minNights={l.minNights}
              currency={l.currency}
              paymentsEnabled={payments.enabled}
              baseRate={l.baseRate}
            />
            <div className="mt-3 text-center text-sm text-[var(--ta-muted)]">
              Booked directly with the owner · no platform fees
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
