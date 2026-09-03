import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  if (!user) redirect("/login");

  void cookies;
  return (
    <div className="min-h-screen bg-[var(--ta-bg-tint)]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--ta-muted)]">Owner dashboard</p>
            <h1 className="text-2xl font-extrabold text-[var(--ta-black)]">Hawk's Nest</h1>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button className="ta-btn ta-btn--outline">Sign out</button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
