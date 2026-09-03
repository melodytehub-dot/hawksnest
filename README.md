# Hawk's Nest — Direct-Booking Vacation Rental

A Next.js + Postgres direct-booking website for **Hawk's Nest**, a spacious country-club estate in Port St. Lucie, Florida. Built with a TripAdvisor-inspired design system, a real booking engine, iCal availability sync (Airbnb + Vrbo), and an owner dashboard.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: PostgreSQL on Vercel via Prisma 7 (`@prisma/adapter-pg`)
- **Payments**: Stripe (gated until keys are added)
- **Email**: Resend (graceful fallback until configured)
- **Styling**: Tailwind CSS v4

## Getting started

```bash
npm install          # runs prisma generate
cp .env.example .env # fill in values (see Vercel Postgres)
npm run db:migrate   # apply schema
npm run db:seed      # seed listing, photos, rooms, amenities, materials
npm run dev          # http://localhost:3000
```

## Environment variables

See `.env.example`. Keys required to enable features:

- `DATABASE_URL` — Vercel Postgres connection string.
- `AUTH_SECRET` — long random string for dashboard sessions.
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — enable online payments.
- `EMAIL_ENABLED` / `RESEND_API_KEY` — enable confirmation + owner emails.
- `AIRBNB_ICAL_URL` / `VRBO_ICAL_URL` — availability calendar feeds.

## Dashboard

Owner/admin login at `/dashboard`. Manage the listing, seasonal rates, calendar blocks, bookings, iCal sync sources, and the material checklist for the project agreement.

## Sync

An API route + cron job pulls the Airbnb & Vrbo iCalendar feeds and blocks matching nights to prevent double-bookings. Runs on a schedule; a manual trigger lives in the dashboard.
