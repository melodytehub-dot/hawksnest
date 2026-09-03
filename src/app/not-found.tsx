import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="text-6xl">🏠</div>
      <h1 className="mt-4 text-2xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-[var(--ta-muted)]">We couldn't find that page.</p>
      <Link href="/" className="ta-btn ta-btn--primary mt-6">Back home</Link>
    </div>
  );
}
