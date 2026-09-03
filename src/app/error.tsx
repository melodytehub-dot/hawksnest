"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);
  return (
    <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-center px-4 py-28 text-center">
      <div className="text-6xl text-[var(--ta-gold)]">!</div>
      <h1 className="mt-4 text-2xl font-extrabold text-[var(--ta-black)] md:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-[var(--ta-muted)]">
        We hit a hiccup loading this page. Try again, or reach the owner directly if it
        keeps happening.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => reset()} className="ta-btn ta-btn--primary">
          Try again
        </button>
        <Link href="/" className="ta-btn ta-btn--outline">
          Go to home
        </Link>
      </div>
    </div>
  );
}
