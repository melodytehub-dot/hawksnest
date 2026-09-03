// Seed: builds the Listing record, ordered gallery with albums/captions,
// rooms, amenities, and materials checklist. Run via `npx prisma db seed`.
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432/hawksnest" });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// ── Data (from real Airbnb scrape; see documents/listing-seed.json) ──
const GALLERY_COUNT = 190;
const albumData = [
  { album: "Living room", count: 21, caption: "We have two living rooms! A formal near the kitchen and a casual near the patio area that includes a pull out bed on the mini sofa. Bring the whole family!" },
  { album: "Full kitchen", count: 18, caption: null },
  { album: "Dining area", count: 13, caption: "Many dining options for you! We have two breakfast bars with stools, a table in the formal and the large outdoor patio." },
  { album: "Bedroom 1", count: 6, caption: "Our master Zen bedroom has a king-size bed, futon bed, TV, extra AC and serene setting. The Master Zen Bathroom is off this bedroom." },
  { album: "Bedroom 2", count: 10, caption: "The captain's room features a full sized bed with a trundle bed underneath that pulls out — great for the kids." },
  { album: "Bedroom 3", count: 12, caption: "The spacious jungle room features a queen size bed and a large double door passthrough closet. Wonderful views." },
  { album: "Bedroom 4", count: 5, caption: "The rainbow room is spacious including a bunk bed with a twin size mattress & a queen size mattress. The sofa also converts." },
  { album: "Bedroom 5", count: 9, caption: "Our guitar room includes a queen size bed with a saltwater fish tank! Complete with a built in granite desk." },
  { album: "Full bathroom 1", count: 14, caption: "This is the Master Zen bathroom, completely private from the main house located off the master bedroom." },
  { album: "Full bathroom 2", count: 1, caption: "This is the Snook bathroom! Completely remodeled with a roomy shower and plenty of counter space." },
  { album: "Full bathroom 3", count: 3, caption: "The flamingo bathroom features a bathtub and bidet. Nothing but toilet paper is allowed to be flushed." },
  { album: "Office", count: 3, caption: "The office is located in the guitar room and features a granite desk, lamp and office chair. Views of the pass-through closet." },
  { album: "Backyard", count: 6, caption: null },
  { album: "Patio", count: 19, caption: null },
  { album: "Laundry area", count: 1, caption: "Our laundry room has everything you might need! Laundry soap, iron, iron board. It's also where you enter behind the garage." },
  { album: "Exterior", count: 15, caption: "Our exterior is landscaped in lush Florida tropics. Plenty of parking makes your stay enjoyable for everyone." },
  { album: "Pool", count: 21, caption: "Our pool is amazing with its lush tropical landscaping! Waterfall, benches and plenty of room for everyone." },
  { album: "Hot tub", count: 4, caption: "The hot tub is heated for year-round relaxation." },
  { album: "Additional photos", count: 9, caption: "Eclectic no-fuss antiques and modern decor mesh into our space giving you a warm and home-like atmosphere." },
];

const roomData = [
  { name: "Bedroom 1", sort: 1, beds: [{ name: "King bed", count: 1 }, { name: "Double bed", count: 1 }], photo: "/images/airbnb/g-039.jpg" },
  { name: "Bedroom 2", sort: 2, beds: [{ name: "Single bed", count: 1 }, { name: "Small double bed", count: 1 }], photo: "/images/airbnb/g-170.jpg" },
  { name: "Bedroom 3", sort: 3, beds: [{ name: "Queen bed", count: 1 }], photo: "/images/airbnb/g-144.jpg" },
  { name: "Bedroom 4", sort: 4, beds: [{ name: "Queen bed", count: 1 }, { name: "Single bed", count: 1 }, { name: "Sofa bed", count: 1 }, { name: "Bunk bed", count: 1 }, { name: "Couch", count: 1 }], photo: "/images/airbnb/g-150.jpg" },
  { name: "Bedroom 5", sort: 5, beds: [{ name: "Queen bed", count: 1 }], photo: "/images/airbnb/g-161.jpg" },
  { name: "Living room", sort: 6, beds: [{ name: "Sofa bed", count: 1 }, { name: "Couch", count: 4 }], photo: "/images/airbnb/g-187.jpg" },
];

const amenities = [
  { group: "Bathroom", items: ["Bathtub", "Hair dryer", "Cleaning products", "Shampoo", "Conditioner", "Body soap", "Bidet", "Hot water", "Shower gel"] },
  { group: "Bedroom and laundry", items: ["Washer", "Dryer", "Clothing storage", "Iron", "Essentials", "Extra pillows and blankets"] },
  { group: "Entertainment", items: ["TV", "Pool table", "Books and reading material", "Children's books and toys"] },
  { group: "Family", items: ["Board games", "Baby monitor", "High chair", "Children's dinnerware", "Pack 'n play / travel crib"] },
  { group: "Heating and cooling", items: ["Air conditioning", "Ceiling fan"] },
  { group: "Home safety", items: ["Carbon monoxide alarm", "Smoke alarm", "First aid kit", "Fire extinguisher"] },
  { group: "Internet and office", items: ["Wifi", "Dedicated workspace"] },
  { group: "Kitchen and dining", items: ["Kitchen", "Refrigerator", "Microwave", "Dishwasher", "Coffee maker", "Dishes and silverware", "Cooking basics"] },
  { group: "Outdoor", items: ["Backyard", "Outdoor kitchen", "BBQ grill", "Patio or balcony", "Hammock"] },
  { group: "Parking and facilities", items: ["Free parking on premises", "Pool", "Hot tub", "Waterfront"] },
  { group: "Services", items: ["Pets allowed", "Self check-in", "Luggage dropoff allowed", "Long term stays allowed"] },
];

const materials = [
  { key: "photos_room", label: "Photos arranged by room", note: "~75 photos organized by room (done — pulled from Airbnb)", done: true },
  { key: "rates", label: "Current rates (seasonal + minimum stays)", note: "Needed for accurate quotes & booking", done: false },
  { key: "taxes_fees", label: "Tax & fee amounts (sales, resort, cleaning, pet)", note: "Used to auto-calculate checkout total", done: false },
  { key: "stripe", label: "Stripe account + API keys", note: "Required to take payments (checkout is gated until ready)", done: false },
  { key: "domain_dns", label: "GoDaddy access for hawksnestflorida.com", note: "To point the domain to Vercel", done: false },
  { key: "branding", label: "Branding / contact / content details", note: "Logo, favicon, phone number, socials", done: false },
];

async function main() {
  console.log("Seeding listing + media + rooms + materials…");

  const listing = await prisma.listing.upsert({
    where: { slug: "spacious-estate-home-country-club-pool" },
    update: {},
    create: {
      slug: "spacious-estate-home-country-club-pool",
      name: "Hawk's Nest",
      title: "Spacious Estate Home · Country Club Pool & Patio",
      subtitle: "Entire home in Port St. Lucie, Florida",
      description:
        "Spacious estate home with plenty of room for family and friends. Gourmet chef's kitchen. Huge screened porch covers a tropical pool with waterfall and hot tub. Pool table, games and books for the kids! The whole house is yours, except for the garage.",
      longDescription:
        "Eclectic estate sized home! 5 bedrooms, 1 king bed, 3 queen beds, one full bed with a trundle, bunk bed with single on top & queen on bottom, 2 pull out couches, 1 queen & one single bed, 1 futon bed. 3 bathrooms with amenities like bidets & a luxury shower in the master suite! The outdoor living area has a huge back porch, pool area, bbq & griddle, tranquil waterfall, garden area with a hot tub. Please note! This home is located in a quiet residential area. NO LOUD PARTIES ALLOWED.",
      address: "2065 SE Van Kleff Ave, Port St. Lucie, FL 34952",
      city: "Port St. Lucie",
      state: "FL",
      country: "United States",
      lat: 27.2492,
      lng: -80.2896,
      maxGuests: 16,
      bedrooms: 5,
      bathrooms: 3,
      beds: 13,
      minNights: 2,
      rating: 4.81,
      reviewCount: 31,
      airbnbIcalUrl: "https://www.airbnb.com/calendar/ical/1258125625335459709.ics?t=4fcdbfff860246298d00f5d81e30d3b2&locale=en",
      vrboIcalUrl: "https://www.vrbo.com/icalendar/f120f20a00b4453e8c9e2f76ff4cab81.ics?nonTentative",
      airbnbUrl: "https://www.airbnb.com/rooms/1258125625335459709",
      paymentsEnabled: false,
    },
  });

  // photos
  let gOrder = 0;
  let heroSet = false;
  for (const a of albumData) {
    for (let i = 0; i < a.count; i++) {
      const src = `/images/airbnb/g-${String(gOrder).padStart(3, "0")}.jpg`;
      const isHero = !heroSet && a.album === "Pool" && i === 0;
      await prisma.listingPhoto.upsert({
        where: { id: `seed-p-${gOrder}` },
        update: { order: gOrder },
        create: {
          id: `seed-p-${gOrder}`,
          listingId: listing.id,
          src,
          order: gOrder,
          album: a.album,
          caption: a.caption,
          tags: [a.album.toLowerCase()],
          isHero,
        },
      });
      if (isHero) heroSet = true;
      gOrder++;
    }
  }

  // rooms
  for (const r of roomData) {
    await prisma.room.upsert({
      where: { id: `seed-r-${r.sort}` },
      update: {},
      create: { id: `seed-r-${r.sort}`, listingId: listing.id, name: r.name, sort: r.sort, beds: r.beds, photo: r.photo },
    });
  }

  // amenities (stored on listing as JSON via a generic table? -> store on listing.amenitiesText)
  await prisma.listing.update({
    where: { id: listing.id },
    data: { amenitiesText: JSON.stringify(amenities) },
  });

  // materials checklist
  for (const m of materials) {
    await prisma.material.upsert({
      where: { key: m.key },
      update: {},
      create: m,
    });
  }

  console.log("Seed complete:", listing.title, "| photos:", gOrder, "| rooms:", roomData.length);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
