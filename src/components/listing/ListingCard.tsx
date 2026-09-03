import Link from "next/link";
import Image from "next/image";
import { starIcon, pinIcon } from "@/components/site/icons";

export interface ListingCardListing {
  slug: string;
  title: string;
  subtitle: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  heroSrc: string;
  photoCount: number;
}

export default function ListingCard({ listing }: { listing: ListingCardListing }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--ta-border)] bg-white transition-shadow hover:shadow-lg">
      {/* Media */}
      <Link href={`/stay/${listing.slug}`} className="group relative block aspect-[4/3] overflow-hidden">
        <Image
          src={listing.heroSrc}
          alt={listing.title}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[var(--ta-black)]">
          {listing.photoCount} photos
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          View the estate
        </span>
      </Link>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--ta-green)] text-white">
            {starIcon({ className: "h-4 w-4" })}
          </span>
          <span className="font-bold text-[var(--ta-black)]">{listing.rating.toFixed(2)}</span>
          <span className="text-[var(--ta-muted)]">· {listing.reviewCount} reviews</span>
        </div>

        <h2 className="mt-3 text-lg font-extrabold leading-snug text-[var(--ta-black)]">
          <Link href={`/stay/${listing.slug}`} className="hover:text-[var(--ta-green)]">
            {listing.title}
          </Link>
        </h2>
        <p className="mt-1 flex items-center gap-1 text-sm text-[var(--ta-muted)]">
          <span className="text-[var(--ta-green)]">{pinIcon}</span>
          {listing.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5 text-sm text-[var(--ta-text)]">
          <span className="rounded-md bg-[var(--ta-bg-soft)] px-2.5 py-1">{listing.bedrooms} bedrooms</span>
          <span className="rounded-md bg-[var(--ta-bg-soft)] px-2.5 py-1">{listing.bathrooms} baths</span>
          <span className="rounded-md bg-[var(--ta-bg-soft)] px-2.5 py-1">sleeps {listing.maxGuests}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--ta-border-soft)] pt-4">
          <div>
            <span className="text-base font-extrabold text-[var(--ta-green)]">Rates on request</span>
            <span className="block text-xs text-[var(--ta-muted)]">entire estate · per night</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/stay/${listing.slug}`} className="ta-btn ta-btn--primary">
            View the estate
          </Link>
          <Link href={`/stay/${listing.slug}#check`} className="ta-btn ta-btn--outline">
            Check availability
          </Link>
        </div>
      </div>
    </article>
  );
}
