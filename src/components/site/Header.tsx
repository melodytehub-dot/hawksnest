"use client";

import Link from "next/link";
import { useState } from "react";
import { hamburger } from "./icons";
import { AGENT } from "@/lib/config";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--ta-border-soft)] bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-4 py-3 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-[var(--ta-green)]">
            <svg viewBox="0 0 36 36" className="h-9 w-9" fill="currentColor" aria-hidden="true">
              <path d="M18 2C9.2 2 2 9.2 2 18s7.2 16 16 16 16-7.2 16-16S26.8 2 18 2zm0 29C10.8 31 5 25.2 5 18S10.8 5 18 5s13 5.8 13 13-5.8 13-13 13z" />
              <path d="M18 9l3.5 6 .9-1.6L28 9c-2.7-2.5-6.2-4-10-4s-7.3 1.5-10 4l5.6 4.4L14 15z" />
              <path d="M11.6 17.8c-3 0-5.4 2.4-5.4 5.4 0 3.6 3.2 6.8 7 6.8s7-3.2 7-6.8c0-1.9-.9-3.5-2.4-4.5l1.5-2.6-1.7-1-1.4 2.5c-.9-.3-1.8-.4-2.6-.4-1.9 0-3.6.7-4.9 1.9l-1.7-3z" fill="#fff" />
              <circle cx="13" cy="20" r="2.2" fill={themeIcon} />
            </svg>
            <span className="sr-only">Hawk's Nest</span>
          </Link>

          {/* Tagline */}
          <div className="hidden min-w-0 md:block lg:block">
            <div className="truncate text-[15px] font-bold leading-tight text-[var(--ta-black)]">Hawk's Nest</div>
            <div className="text-xs text-[var(--ta-muted)]">Port St. Lucie · Florida</div>
          </div>

          {/* Nav (desktop) */}
          <nav className="ml-auto hidden items-center gap-1 md:flex">
            <Link className="rounded px-3 py-2 text-sm font-semibold text-[var(--ta-text)] hover:bg-[var(--ta-bg-soft)]" href="/">
              Home
            </Link>
            <Link className="rounded px-3 py-2 text-sm font-semibold text-[var(--ta-text)] hover:bg-[var(--ta-bg-soft)]" href={AGENT.bookingRoute}>
              The Estate
            </Link>
            <Link className="rounded px-3 py-2 text-sm font-semibold text-[var(--ta-text)] hover:bg-[var(--ta-bg-soft)]" href="/about">
              About
            </Link>
            <Link className="rounded px-3 py-2 text-sm font-semibold text-[var(--ta-text)] hover:bg-[var(--ta-bg-soft)]" href="/contact">
              Contact
            </Link>
            <Link className="ta-btn ta-btn--primary ml-2" href={`${AGENT.bookingRoute}#check`}>
              Check dates
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[var(--ta-bg-soft)] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {hamburger}
          </button>
        </div>
      </header>

      {/* Mobile nav sheet */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <div className="mt-16 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <nav className="flex flex-col gap-1">
              <Link className="rounded px-3 py-3 text-base font-semibold hover:bg-[var(--ta-bg-soft)]" href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link className="rounded px-3 py-3 text-base font-semibold hover:bg-[var(--ta-bg-soft)]" href={AGENT.bookingRoute} onClick={() => setOpen(false)}>
                The Estate
              </Link>
              <Link className="rounded px-3 py-3 text-base font-semibold hover:bg-[var(--ta-bg-soft)]" href="/about" onClick={() => setOpen(false)}>
                About
              </Link>
              <Link className="rounded px-3 py-3 text-base font-semibold hover:bg-[var(--ta-bg-soft)]" href="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
              <Link className="ta-btn ta-btn--primary mt-3" href={`${AGENT.bookingRoute}#check`} onClick={() => setOpen(false)}>
                Check dates
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

const themeIcon = "#00aa6c";
