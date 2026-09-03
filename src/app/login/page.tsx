"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Login failed."); setLoading(false); return; }
      router.push("/dashboard");
    } catch {
      setErr("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-center text-2xl font-extrabold text-[var(--ta-black)]">Owner sign in</h1>
      <p className="mb-6 text-center text-sm text-[var(--ta-muted)]">Manage Hawk's Nest</p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-[var(--ta-border)] px-3 py-2.5 text-sm focus:border-[var(--ta-green)] focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[var(--ta-border)] px-3 py-2.5 text-sm focus:border-[var(--ta-green)] focus:outline-none"
        />
        {err && <div className="text-sm font-medium text-[var(--ta-red)]">{err}</div>}
        <button className="ta-btn ta-btn--primary" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
