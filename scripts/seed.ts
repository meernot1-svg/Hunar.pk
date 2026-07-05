/**
 * Hunar.pk — Database seed script
 * Populates the DB with initial workers, kaams, and the admin account.
 *
 * Run with:  bun run db:seed
 */
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

type WorkerSeed = {
  id: string;
  name: string;
  city: string;
  level: "New" | "Rising" | "Top";
  rating: number;
  totalKaam: number;
  repeatClients: number;
  gradient: string;
  initials: string;
  phone: string;
  bio: string;
  portfolio: string[];
};

type KaamSeed = {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: 1 | 3 | 7 | 15;
  category: string;
  workerId: string;
  rating: number;
  reviews: number;
  image: string;
};

const WORKERS: WorkerSeed[] = [
  {
    id: "w1",
    name: "Ahmed Raza",
    city: "Karachi",
    level: "Top",
    rating: 4.9,
    totalKaam: 214,
    repeatClients: 78,
    gradient: "from-emerald-500 to-teal-600",
    initials: "AR",
    phone: "923001234567",
    bio: "5 years of experience in logo and brand identity design. Studied graphic design at Karachi University.",
    portfolio: ["g1", "g2", "g3", "g4", "g5", "g6"],
  },
  {
    id: "w2",
    name: "Fatima Khan",
    city: "Lahore",
    level: "Rising",
    rating: 4.8,
    totalKaam: 96,
    repeatClients: 41,
    gradient: "from-pink-500 to-rose-600",
    initials: "FK",
    phone: "923011234568",
    bio: "WordPress developer and SEO specialist. Based in Lahore, built 200+ websites.",
    portfolio: ["g2", "g4", "g1", "g6", "g3", "g5"],
  },
  {
    id: "w3",
    name: "Hassan Ali",
    city: "Islamabad",
    level: "Top",
    rating: 5.0,
    totalKaam: 188,
    repeatClients: 92,
    gradient: "from-sky-500 to-indigo-600",
    initials: "HA",
    phone: "923021234569",
    bio: "YouTube video editor and color grading expert. 4K editing, fast delivery guaranteed.",
    portfolio: ["g3", "g1", "g5", "g2", "g4", "g6"],
  },
  {
    id: "w4",
    name: "Ayesha Siddiqui",
    city: "Rawalpindi",
    level: "Rising",
    rating: 4.7,
    totalKaam: 73,
    repeatClients: 35,
    gradient: "from-violet-500 to-purple-600",
    initials: "AS",
    phone: "923031234570",
    bio: "Urdu and English content writer. Blogs, articles, and website copy.",
    portfolio: ["g4", "g6", "g2", "g1", "g5", "g3"],
  },
  {
    id: "w5",
    name: "Ali Hamza",
    city: "Faisalabad",
    level: "New",
    rating: 4.6,
    totalKaam: 24,
    repeatClients: 8,
    gradient: "from-amber-500 to-orange-600",
    initials: "AH",
    phone: "923041234571",
    bio: "Social media manager and Facebook ads expert. New but results guaranteed.",
    portfolio: ["g5", "g3", "g1", "g6", "g2", "g4"],
  },
  {
    id: "w6",
    name: "Zainab Malik",
    city: "Multan",
    level: "Top",
    rating: 4.9,
    totalKaam: 152,
    repeatClients: 64,
    gradient: "from-cyan-500 to-blue-600",
    initials: "ZM",
    phone: "923051234572",
    bio: "Mobile app developer (Flutter + React Native). 50+ apps live on Play Store.",
    portfolio: ["g6", "g2", "g4", "g3", "g1", "g5"],
  },
];

const KAAMS: KaamSeed[] = [
  { id: "k1", title: "Logo design 24 ghante mein", description: "Professional logo design with 3 concepts, unlimited revisions aur source files.", price: 2500, deliveryDays: 1, category: "logo", workerId: "w1", rating: 4.9, reviews: 127, image: "g1" },
  { id: "k2", title: "WordPress website banayen", description: "Complete responsive WordPress website with premium theme aur SEO setup.", price: 18000, deliveryDays: 7, category: "web", workerId: "w2", rating: 4.8, reviews: 64, image: "g2" },
  { id: "k3", title: "YouTube video edit karunga", description: "Professional video editing with color grading, transitions aur sound design.", price: 5000, deliveryDays: 3, category: "video", workerId: "w3", rating: 5.0, reviews: 89, image: "g3" },
  { id: "k4", title: "Urdu article likhunga", description: "1000 words ka SEO-optimized Urdu article kisi bhi topic par.", price: 1500, deliveryDays: 3, category: "writing", workerId: "w4", rating: 4.7, reviews: 52, image: "g4" },
  { id: "k5", title: "SEO optimize karunga", description: "On-page SEO audit aur optimization Google ranking ke liye.", price: 8000, deliveryDays: 7, category: "seo", workerId: "w2", rating: 4.8, reviews: 38, image: "g5" },
  { id: "k6", title: "Facebook page manage karunga", description: "Monthly social media management with 30 posts aur engagement.", price: 12000, deliveryDays: 15, category: "social", workerId: "w5", rating: 4.6, reviews: 19, image: "g6" },
  { id: "k7", title: "Flutter app banayen", description: "Cross-platform mobile app Android aur iOS ke liye, with API integration.", price: 45000, deliveryDays: 15, category: "app", workerId: "w6", rating: 4.9, reviews: 31, image: "g2" },
  { id: "k8", title: "Product photography karunga", description: "Professional product shoot with studio lighting aur editing.", price: 6000, deliveryDays: 3, category: "photo", workerId: "w3", rating: 4.9, reviews: 44, image: "g1" },
  { id: "k9", title: "Brand identity package", description: "Logo, business card, letterhead aur social media templates — sab kuch.", price: 7500, deliveryDays: 7, category: "logo", workerId: "w1", rating: 5.0, reviews: 73, image: "g3" },
  { id: "k10", title: "Blog content likhunga", description: "Engaging English blog posts 1500 words, SEO friendly aur plagiarism free.", price: 3000, deliveryDays: 3, category: "writing", workerId: "w4", rating: 4.7, reviews: 28, image: "g4" },
  { id: "k11", title: "Instagram reels banayen", description: "15 viral Instagram reels with trending audio aur captions.", price: 4000, deliveryDays: 7, category: "social", workerId: "w5", rating: 4.6, reviews: 22, image: "g6" },
  { id: "k12", title: "React website banayen", description: "Modern React + Next.js website with fast loading aur beautiful UI.", price: 35000, deliveryDays: 15, category: "web", workerId: "w6", rating: 4.9, reviews: 17, image: "g2" },
];

const VIEWERS = [
  { id: "u1", name: "Bilal Ahmed", city: "Karachi", phone: "923061111111", joined: "2025" },
  { id: "u2", name: "Sana Tariq", city: "Lahore", phone: "923062222222", joined: "2025" },
  { id: "u3", name: "Usman Ghani", city: "Islamabad", phone: "923063333333", joined: "2025" },
];

async function main() {
  console.log("🌱 Seeding Hunar.pk database...");

  // Wipe existing data (preserve uploads on disk)
  await db.kaam.deleteMany();
  await db.worker.deleteMany();
  await db.user.deleteMany();
  console.log("  · Cleared existing rows");

  // ---- Admin ----
  const adminPass = await hashPassword("admin123");
  await db.user.create({
    data: {
      id: "admin",
      name: "Site Admin",
      phone: "923000000000",
      password: adminPass,
      role: "admin",
      city: "Islamabad",
      joined: "2023",
    },
  });
  console.log("  · Created admin account (phone: 923000000000, password: admin123)");

  // ---- Workers (each gets a linked User + Worker profile) ----
  for (const w of WORKERS) {
    const userPass = await hashPassword("worker123");
    await db.user.create({
      data: {
        id: w.id,
        name: w.name,
        phone: w.phone,
        password: userPass,
        role: "worker",
        city: w.city,
        joined: "2024",
        worker: {
          create: {
            id: w.id,
            name: w.name,
            city: w.city,
            level: w.level,
            rating: w.rating,
            totalKaam: w.totalKaam,
            repeatClients: w.repeatClients,
            phone: w.phone,
            bio: w.bio,
            gradient: w.gradient,
            initials: w.initials,
            portfolio: JSON.stringify(w.portfolio),
          },
        },
      },
    });
  }
  console.log(`  · Created ${WORKERS.length} worker accounts (password: worker123)`);

  // ---- Kaams ----
  for (const k of KAAMS) {
    await db.kaam.create({
      data: {
        id: k.id,
        title: k.title,
        description: k.description,
        price: k.price,
        deliveryDays: k.deliveryDays,
        category: k.category,
        workerId: k.workerId,
        rating: k.rating,
        reviews: k.reviews,
        image: k.image,
      },
    });
  }
  console.log(`  · Created ${KAAMS.length} kaam posts`);

  // ---- Viewers ----
  for (const v of VIEWERS) {
    const vPass = await hashPassword("viewer123");
    await db.user.create({
      data: {
        id: v.id,
        name: v.name,
        phone: v.phone,
        password: vPass,
        role: "viewer",
        city: v.city,
        joined: v.joined,
      },
    });
  }
  console.log(`  · Created ${VIEWERS.length} viewer accounts (password: viewer123)`);

  console.log("\n✅ Seed complete!");
  console.log("   Admin:    phone 923000000000 / password admin123");
  console.log("   Worker:   phone 92300XXXXXXX / password worker123");
  console.log("   Viewer:   phone 92306XXXXXXX / password viewer123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
