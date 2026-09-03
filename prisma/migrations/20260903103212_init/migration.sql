-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '2065 SE Van Kleff Ave, Port St. Lucie, FL 34952',
    "city" TEXT NOT NULL DEFAULT 'Port St. Lucie',
    "state" TEXT NOT NULL DEFAULT 'FL',
    "country" TEXT NOT NULL DEFAULT 'United States',
    "lat" DOUBLE PRECISION NOT NULL DEFAULT 27.2492,
    "lng" DOUBLE PRECISION NOT NULL DEFAULT -80.2896,
    "maxGuests" INTEGER NOT NULL DEFAULT 16,
    "bedrooms" INTEGER NOT NULL DEFAULT 5,
    "bathrooms" DOUBLE PRECISION NOT NULL DEFAULT 3,
    "beds" INTEGER NOT NULL DEFAULT 13,
    "baseRate" INTEGER NOT NULL DEFAULT 0,
    "cleaningFee" INTEGER NOT NULL DEFAULT 0,
    "petFee" INTEGER NOT NULL DEFAULT 0,
    "taxRatePct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minNights" INTEGER NOT NULL DEFAULT 2,
    "maxNights" INTEGER,
    "availabilityEnabled" BOOLEAN NOT NULL DEFAULT true,
    "paymentsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "rateNote" TEXT NOT NULL DEFAULT '',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "amenitiesText" TEXT NOT NULL DEFAULT '[]',
    "airbnbIcalUrl" TEXT NOT NULL DEFAULT '',
    "vrboIcalUrl" TEXT NOT NULL DEFAULT '',
    "airbnbUrl" TEXT NOT NULL DEFAULT '',
    "vrboUrl" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPhoto" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "album" TEXT,
    "caption" TEXT,
    "tags" TEXT[],
    "isHero" BOOLEAN NOT NULL DEFAULT false,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "beds" JSONB,
    "photo" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateOverride" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "nightly" INTEGER NOT NULL,
    "minNights" INTEGER,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarBlock" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "reason" TEXT,
    "uid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalendarBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "checkIn" DATE NOT NULL,
    "checkOut" DATE NOT NULL,
    "nights" INTEGER NOT NULL,
    "guests" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "nightlyTotal" INTEGER NOT NULL DEFAULT 0,
    "cleaningFee" INTEGER NOT NULL DEFAULT 0,
    "petFee" INTEGER NOT NULL DEFAULT 0,
    "taxes" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL DEFAULT 'direct',
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "checkIn" DATE NOT NULL,
    "checkOut" DATE NOT NULL,
    "nights" INTEGER NOT NULL,
    "guests" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT NOT NULL DEFAULT 'direct',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "events" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "note" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");

-- CreateIndex
CREATE INDEX "ListingPhoto_listingId_order_idx" ON "ListingPhoto"("listingId", "order");

-- CreateIndex
CREATE INDEX "Room_listingId_sort_idx" ON "Room"("listingId", "sort");

-- CreateIndex
CREATE INDEX "RateOverride_listingId_startDate_idx" ON "RateOverride"("listingId", "startDate");

-- CreateIndex
CREATE INDEX "CalendarBlock_listingId_date_idx" ON "CalendarBlock"("listingId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarBlock_listingId_date_key" ON "CalendarBlock"("listingId", "date");

-- CreateIndex
CREATE INDEX "Booking_listingId_checkIn_idx" ON "Booking"("listingId", "checkIn");

-- CreateIndex
CREATE INDEX "BookingRequest_listingId_createdAt_idx" ON "BookingRequest"("listingId", "createdAt");

-- CreateIndex
CREATE INDEX "SyncLog_listingId_createdAt_idx" ON "SyncLog"("listingId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Material_key_key" ON "Material"("key");

-- AddForeignKey
ALTER TABLE "ListingPhoto" ADD CONSTRAINT "ListingPhoto_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateOverride" ADD CONSTRAINT "RateOverride_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarBlock" ADD CONSTRAINT "CalendarBlock_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncLog" ADD CONSTRAINT "SyncLog_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
