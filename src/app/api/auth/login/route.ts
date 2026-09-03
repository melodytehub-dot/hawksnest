import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });

  await createSession({ id: user.id, email: user.email, name: user.name });
  return NextResponse.json({ ok: true });
}
