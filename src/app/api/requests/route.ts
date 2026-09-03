import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getListingBySlug } from "@/lib/data";
import { nightsBetween, todayISO, formatDate } from "@/lib/dates";
import { notifyOwner, guestConfirmationEmail, sendEmail } from "@/lib/email";
import { getPaymentsConfig } from "@/lib/config";

const SLUG = process.env.LISTING_SLUG || "spacious-estate-home-country-club-pool";

/** POST /api/requests { checkIn, checkOut, guests, name, email, message } */
export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const checkIn = String(body?.checkIn || "");
  const checkOut = String(body?.checkOut || "");
  const guests = Number(body?.guests || 0);
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const message = String(body?.message || "").trim();

  const today = todayISO();
  if (!checkIn || !checkOut) return NextResponse.json({ error: "Select check-in and check-out dates." }, { status: 400 });
  if (checkIn < today) return NextResponse.json({ error: "Check-in can't be in the past." }, { status: 400 });
  if (checkOut <= checkIn) return NextResponse.json({ error: "Check-out must be after check-in." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

  const data = await getListingBySlug(SLUG);
  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });

  const nights = nightsBetween(checkIn, checkOut);
  const payments = getPaymentsConfig();

  const request = await prisma.bookingRequest.create({
    data: {
      listingId: data.listing.id,
      checkIn: new Date(`${checkIn}T00:00:00Z`),
      checkOut: new Date(`${checkOut}T00:00:00Z`),
      nights,
      guests,
      name,
      email,
      message,
      source: "direct",
    },
  });

  // Notify owner + send guest a confirmation (graceful fallback if email disabled)
  try {
    await notifyOwner(
      `New booking request — ${name}, ${formatDate(checkIn)} → ${formatDate(checkOut)}`,
      `<p><strong>${name}</strong> &lt;${email}&gt; requests ${formatDate(checkIn)} → ${formatDate(checkOut)} (${nights} nights, ${guests} guests).</p>${message ? `<p>${message}</p>` : ""}`
    );
    const g = guestConfirmationEmail({
      name,
      checkIn: formatDate(checkIn),
      checkOut: formatDate(checkOut),
      nights,
      total: "Confirmed by the owner",
      status: "pending",
    });
    await sendEmail({ to: email, subject: g.subject, html: g.html });
  } catch (e) {
    console.error("email notify failed", e);
  }

  return NextResponse.json({ ok: true, id: request.id, paymentsEnabled: payments.enabled }, { status: 201 });
}
