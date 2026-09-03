import { cache } from "react";

// Global site config read from env with sensible defaults.
// Owner/admin endpoints use NEXT_PUBLIC_* only where they must reach the browser.

export const SITE = {
  name: "Hawk's Nest",
  tagline: "Spacious Estate Home · Country Club Pool & Patio",
  city: "Port St. Lucie",
  region: "Treasure Coast · Florida",
  address: "2065 SE Van Kleff Ave, Port St. Lucie, FL 34952",
  ownerEmail: process.env.OWNER_EMAIL || "Hawklevy@gmail.com",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: process.env.PHONE || "",
} as const;

export const AGENT = {
  bookingRoute: "/stay/spacious-estate-home-country-club-pool",
  listingSlug: "spacious-estate-home-country-club-pool",
} as const;

function envBool(v: string | undefined, fallback: boolean): boolean {
  if (v === undefined) return fallback;
  return v === "true" || v === "1";
}

// Payments only enabled when real Stripe keys are present
export const getPaymentsConfig = cache((): { enabled: boolean; currency: string } => {
  const hasKeys = !!(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return { enabled: hasKeys, currency: process.env.CURRENCY || "USD" };
});

export const EMAIL_ENABLED = () => envBool(process.env.EMAIL_ENABLED, false);
export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
export const EMAIL_FROM = process.env.EMAIL_FROM || "Hawk's Nest <bookings@hawksnestflorida.com>";
export const ADMIN_EMAIL = process.env.OWNER_EMAIL || "Hawklevy@gmail.com";

// iCal feeds (stored on listing, but defaults here for the sync cron)
export const CALENDAR = {
  airbnbIcalUrl: process.env.AIRBNB_ICAL_URL || "https://www.airbnb.com/calendar/ical/1258125625335459709.ics?t=4fcdbfff860246298d00f5d81e30d3b2&locale=en",
  vrboIcalUrl: process.env.VRBO_ICAL_URL || "https://www.vrbo.com/icalendar/f120f20a00b4453e8c9e2f76ff4cab81.ics?nonTentative",
} as const;
