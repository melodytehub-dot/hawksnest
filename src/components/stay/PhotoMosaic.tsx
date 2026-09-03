"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { closeIcon, nextIcon, backIcon } from "@/components/site/icons";

export interface GalleryPhoto {
  src: string;
  order: number;
  album?: string | null;
  caption?: string | null;
  isHero?: boolean;
}

interface Props {
  photos: GalleryPhoto[];
  listingTitle: string;
}

// Build a classic 5-tile "mosaic" layout (TripAdvisor/Airbnb style) from ordered photos.
export default function PhotoMosaic({ photos, listingTitle }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const router = useRouter();

  if (!photos.length) return null;
  const tiles = photos.slice(0, 5);

  const openAt = (i: number) => setOpen(i);

  return (
    <>
      {/* Mosaic grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-1 overflow-hidden rounded-2xl">
        {tiles.map((p, i) => (
          <button
            key={p.order}
            onClick={() => openAt(i)}
            className={`group relative overflow-hidden bg-[var(--ta-bg-soft)] ${i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
            aria-label={`Open photo ${i + 1}`}
          >
            <Image
              src={p.src}
              alt={`${listingTitle} — ${p.album || "photo"}${i === 4 ? " and more" : ""}`}
              fill
              sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "25vw"}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={i === 0}
            />
            {i === 4 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-semibold text-white">
                View all {photos.length} photos
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-[var(--ta-black)]"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          <div className="flex items-center justify-between p-4">
            <span className="text-sm font-semibold text-white">
              {open + 1} / {photos.length} · {photos[open]?.album || "Photo"}
            </span>
            <button
              onClick={() => setOpen(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Close photo preview"
            >
              {closeIcon}
            </button>
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-0 flex items-center justify-center px-4 pb-4">
              <img
                src={photos[open].src}
                alt={`${photos[open].album || "photo"} — ${listingTitle}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <button
              onClick={() => setOpen((open - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 rtl:rotate-180"
              aria-label="Previous photo"
            >
              {backIcon}
            </button>
            <button
              onClick={() => setOpen((open + 1) % photos.length)}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 rtl:rotate-180"
              aria-label="Next photo"
            >
              {nextIcon}
            </button>
          </div>

          <div className="min-h-[64px] px-4 pb-4 text-center text-sm text-white/90">
            {photos[open]?.caption && <p className="mx-auto max-w-2xl">{photos[open].caption}</p>}
          </div>
        </div>
      )}
    </>
  );
}
