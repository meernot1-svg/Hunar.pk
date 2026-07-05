"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/* ============================================================
   HUNAR.PK — Pakistan's biggest local freelancing network
   Single-page client app. No "Gig" word — only "Kaam".
   ============================================================ */

/* ---------- Types ---------- */
type WorkerLevel = "New" | "Rising" | "Top";
type UserRole = "worker" | "viewer" | "admin";

interface Worker {
  id: string;
  name: string;
  city: string;
  level: WorkerLevel;
  rating: number;
  totalKaam: number;
  repeatClients: number;
  gradient: string; // tailwind gradient classes for avatar
  initials: string;
  phone: string; // 92XXXXXXXXXX
  bio: string;
  portfolio: string[]; // gradient keys
}

interface Kaam {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: 1 | 3 | 7 | 15;
  category: string; // category id
  workerId: string;
  rating: number;
  reviews: number;
  image: string; // gradient key
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: string;
}

interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  city: string;
  phone: string;
  level?: WorkerLevel;
  joined: string;
}

type ViewId = "home" | "explore" | "post" | "profile" | "admin";

/* ---------- Static data ---------- */
const CATEGORIES: Category[] = [
  { id: "logo", name: "Logo Design", icon: "mdi:palette", count: "2.4K+ Kaam" },
  { id: "web", name: "Website", icon: "mdi:web", count: "1.8K+ Kaam" },
  { id: "video", name: "Video Editing", icon: "mdi:video", count: "1.2K+ Kaam" },
  { id: "seo", name: "SEO", icon: "mdi:chart-line-variant", count: "980+ Kaam" },
  { id: "writing", name: "Content Writing", icon: "mdi:pen", count: "3.1K+ Kaam" },
  { id: "social", name: "Social Media", icon: "mdi:facebook", count: "1.5K+ Kaam" },
  { id: "app", name: "App Development", icon: "mdi:cellphone-link", count: "760+ Kaam" },
  { id: "photo", name: "Photography", icon: "mdi:camera", count: "640+ Kaam" },
];

const CITIES = [
  "All Cities",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
];

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
];

const WORKERS: Worker[] = [
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

const INITIAL_KAAMS: Kaam[] = [
  {
    id: "k1",
    title: "Logo design 24 ghante mein",
    description: "Professional logo design with 3 concepts, unlimited revisions aur source files.",
    price: 2500,
    deliveryDays: 1,
    category: "logo",
    workerId: "w1",
    rating: 4.9,
    reviews: 127,
    image: "g1",
  },
  {
    id: "k2",
    title: "WordPress website banayen",
    description: "Complete responsive WordPress website with premium theme aur SEO setup.",
    price: 18000,
    deliveryDays: 7,
    category: "web",
    workerId: "w2",
    rating: 4.8,
    reviews: 64,
    image: "g2",
  },
  {
    id: "k3",
    title: "YouTube video edit karunga",
    description: "Professional video editing with color grading, transitions aur sound design.",
    price: 5000,
    deliveryDays: 3,
    category: "video",
    workerId: "w3",
    rating: 5.0,
    reviews: 89,
    image: "g3",
  },
  {
    id: "k4",
    title: "Urdu article likhunga",
    description: "1000 words ka SEO-optimized Urdu article kisi bhi topic par.",
    price: 1500,
    deliveryDays: 3,
    category: "writing",
    workerId: "w4",
    rating: 4.7,
    reviews: 52,
    image: "g4",
  },
  {
    id: "k5",
    title: "SEO optimize karunga",
    description: "On-page SEO audit aur optimization Google ranking ke liye.",
    price: 8000,
    deliveryDays: 7,
    category: "seo",
    workerId: "w2",
    rating: 4.8,
    reviews: 38,
    image: "g5",
  },
  {
    id: "k6",
    title: "Facebook page manage karunga",
    description: "Monthly social media management with 30 posts aur engagement.",
    price: 12000,
    deliveryDays: 15,
    category: "social",
    workerId: "w5",
    rating: 4.6,
    reviews: 19,
    image: "g6",
  },
  {
    id: "k7",
    title: "Flutter app banayen",
    description: "Cross-platform mobile app Android aur iOS ke liye, with API integration.",
    price: 45000,
    deliveryDays: 15,
    category: "app",
    workerId: "w6",
    rating: 4.9,
    reviews: 31,
    image: "g2",
  },
  {
    id: "k8",
    title: "Product photography karunga",
    description: "Professional product shoot with studio lighting aur editing.",
    price: 6000,
    deliveryDays: 3,
    category: "photo",
    workerId: "w3",
    rating: 4.9,
    reviews: 44,
    image: "g1",
  },
  {
    id: "k9",
    title: "Brand identity package",
    description: "Logo, business card, letterhead aur social media templates — sab kuch.",
    price: 7500,
    deliveryDays: 7,
    category: "logo",
    workerId: "w1",
    rating: 5.0,
    reviews: 73,
    image: "g3",
  },
  {
    id: "k10",
    title: "Blog content likhunga",
    description: "Engaging English blog posts 1500 words, SEO friendly aur plagiarism free.",
    price: 3000,
    deliveryDays: 3,
    category: "writing",
    workerId: "w4",
    rating: 4.7,
    reviews: 28,
    image: "g4",
  },
  {
    id: "k11",
    title: "Instagram reels banayen",
    description: "15 viral Instagram reels with trending audio aur captions.",
    price: 4000,
    deliveryDays: 7,
    category: "social",
    workerId: "w5",
    rating: 4.6,
    reviews: 22,
    image: "g6",
  },
  {
    id: "k12",
    title: "React website banayen",
    description: "Modern React + Next.js website with fast loading aur beautiful UI.",
    price: 35000,
    deliveryDays: 15,
    category: "web",
    workerId: "w6",
    rating: 4.9,
    reviews: 17,
    image: "g2",
  },
];

/* Initial user accounts (workers + viewers + admin) for the admin panel */
const INITIAL_USERS: UserAccount[] = [
  ...WORKERS.map((w) => ({
    id: w.id,
    name: w.name,
    role: "worker" as UserRole,
    city: w.city,
    phone: w.phone,
    level: w.level,
    joined: "2024",
  })),
  { id: "u1", name: "Bilal Ahmed", role: "viewer" as UserRole, city: "Karachi", phone: "923061111111", joined: "2025" },
  { id: "u2", name: "Sana Tariq", role: "viewer" as UserRole, city: "Lahore", phone: "923062222222", joined: "2025" },
  { id: "u3", name: "Usman Ghani", role: "viewer" as UserRole, city: "Islamabad", phone: "923063333333", joined: "2025" },
  { id: "admin", name: "Site Admin", role: "admin" as UserRole, city: "Islamabad", phone: "923000000000", joined: "2023" },
];

/* Gradient map for placeholder images */
const GRADIENTS: Record<string, string> = {
  g1: "from-emerald-500/30 to-teal-600/30",
  g2: "from-sky-500/30 to-indigo-600/30",
  g3: "from-pink-500/30 to-rose-600/30",
  g4: "from-violet-500/30 to-purple-600/30",
  g5: "from-amber-500/30 to-orange-600/30",
  g6: "from-cyan-500/30 to-blue-600/30",
};

const PORTFOLIO_ICONS: Record<string, string> = {
  g1: "mdi:palette",
  g2: "mdi:web",
  g3: "mdi:video",
  g4: "mdi:pen",
  g5: "mdi:facebook",
  g6: "mdi:cellphone-link",
};

const LEVEL_STYLES: Record<WorkerLevel, { badge: string; ring: string; label: string }> = {
  New: {
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    ring: "ring-sky-500/40",
    label: "New",
  },
  Rising: {
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    ring: "ring-violet-500/40",
    label: "Rising",
  },
  Top: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    ring: "ring-amber-500/40",
    label: "Top",
  },
};

const ROLE_STYLES: Record<UserRole, { badge: string; label: string; icon: string }> = {
  worker: { badge: "bg-green-500/15 text-green-400 border-green-500/30", label: "Worker", icon: "mdi:briefcase" },
  viewer: { badge: "bg-sky-500/15 text-sky-400 border-sky-500/30", label: "Viewer", icon: "mdi:account-search" },
  admin: { badge: "bg-amber-500/15 text-amber-400 border-amber-500/30", label: "Admin", icon: "mdi:shield-crown" },
};

/* Admin access password (demo) */
const ADMIN_PASSWORD = "BA56CR7VK18";

/* ---------- Helpers ---------- */
function formatPKR(n: number): string {
  return "Rs. " + n.toLocaleString("en-PK");
}

function deliveryLabel(days: number): string {
  return `${days} day${days > 1 ? "s" : ""}`;
}

function waLink(phone: string, kaamTitle?: string): string {
  const text = kaamTitle
    ? `Assalam o Alaikum! I saw your kaam on Hunar.pk — "${kaamTitle}". Let's discuss the details.`
    : "Assalam o Alaikum! I saw your profile on Hunar.pk. I'd like to hire you for some kaam.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function avatarGradient(name: string): string {
  const grads = [
    "from-emerald-500 to-teal-600",
    "from-pink-500 to-rose-600",
    "from-sky-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return grads[h % grads.length];
}

/* ---------- Reusable UI bits ---------- */

function Logo({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/hunar-logo.svg"
      alt="Hunar.pk logo"
      width={size}
      height={size}
      className="shrink-0 rounded-xl shadow-[0_4px_14px_-4px_rgba(34,197,94,0.55)]"
    />
  );
}

function BrandMark({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5">
      <Logo size={36} />
      <span className="font-display text-xl font-extrabold tracking-tight text-white md:text-2xl">
        Hunar<span className="text-green-400">.pk</span>
      </span>
    </button>
  );
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    let icon = "mdi:star-outline";
    if (i < full) icon = "mdi:star";
    else if (i === full && hasHalf) icon = "mdi:star-half-full";
    stars.push(
      <iconify-icon key={i} icon={icon} width={size} height={size} class="text-amber-400" />,
    );
  }
  return <span className="inline-flex items-center gap-0.5">{stars}</span>;
}

function GradientImage({
  gKey,
  icon,
  className = "",
}: {
  gKey: string;
  icon?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${GRADIENTS[gKey] ?? GRADIENTS.g1} ${className}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      {icon && (
        <iconify-icon
          icon={icon}
          width={40}
          height={40}
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/60"
        />
      )}
    </div>
  );
}

function KaamCard({
  kaam,
  worker,
  onOpen,
  onWorker,
}: {
  kaam: Kaam;
  worker?: Worker;
  onOpen: (k: Kaam) => void;
  onWorker: (id: string) => void;
}) {
  if (!worker) return null;
  const cat = CATEGORIES.find((c) => c.id === kaam.category);

  return (
    <div
      onClick={() => onOpen(kaam)}
      className="group cursor-pointer rounded-2xl border border-white/5 bg-slate-900/60 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40 hover:shadow-[0_0_24px_-4px_rgba(34,197,94,0.35)]"
    >
      {/* Image */}
      <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl">
        <GradientImage gKey={kaam.image} icon={cat?.icon} className="h-full w-full" />
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {cat?.name}
        </span>
      </div>

      {/* Worker row */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onWorker(worker.id);
        }}
        className="mb-2 flex w-full items-center gap-2 text-left"
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${worker.gradient} text-[10px] font-bold text-white`}
        >
          {worker.initials}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs text-slate-300">
          {worker.name}
          <span className="text-slate-500"> · {worker.city}</span>
        </span>
        <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${LEVEL_STYLES[worker.level].badge}`}>
          {worker.level}
        </span>
      </button>

      {/* Title */}
      <h3 className="mb-1 line-clamp-1 text-sm font-bold text-white">{kaam.title}</h3>
      <p className="mb-3 line-clamp-1 text-xs text-slate-400">{kaam.description}</p>

      {/* Rating + delivery */}
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
        <Stars rating={kaam.rating} size={12} />
        <span className="font-medium text-slate-300">{kaam.rating}</span>
        <span className="text-slate-600">({kaam.reviews})</span>
        <span className="text-slate-600">·</span>
        <span className="inline-flex items-center gap-1">
          <iconify-icon icon="mdi:clock-outline" width={12} />
          {deliveryLabel(kaam.deliveryDays)}
        </span>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-extrabold text-green-400">{formatPKR(kaam.price)}</span>
        <a
          href={waLink(worker.phone, kaam.title)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-green-950 transition-colors hover:bg-green-400"
        >
          <iconify-icon icon="mdi:whatsapp" width={14} />
          <span className="hidden sm:inline">WhatsApp Chat</span>
          <span className="sm:hidden">Chat</span>
        </a>
      </div>
    </div>
  );
}

function WorkerCard({ worker, onOpen }: { worker: Worker; onOpen: (id: string) => void }) {
  return (
    <button
      onClick={() => onOpen(worker.id)}
      className="group flex flex-col items-center rounded-2xl border border-white/5 bg-slate-900/60 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40 hover:shadow-[0_0_24px_-4px_rgba(34,197,94,0.35)]"
    >
      <span
        className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${worker.gradient} text-lg font-bold text-white ring-2 ${LEVEL_STYLES[worker.level].ring}`}
      >
        {worker.initials}
      </span>
      <h3 className="text-sm font-bold text-white">{worker.name}</h3>
      <p className="mb-2 flex items-center gap-1 text-xs text-slate-400">
        <iconify-icon icon="mdi:map-marker" width={12} />
        {worker.city}
      </p>
      <span className={`mb-3 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${LEVEL_STYLES[worker.level].badge}`}>
        {worker.level} Worker
      </span>
      <div className="flex items-center gap-1 text-xs text-slate-300">
        <Stars rating={worker.rating} size={12} />
        <span className="font-semibold">{worker.rating}</span>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">{worker.totalKaam} Kaam Done</p>
    </button>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function Home() {
  const [view, setView] = useState<ViewId>("home");
  const [activeNav, setActiveNav] = useState<ViewId>("home");

  // auth
  const [authModal, setAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState<"role" | "form">("role");
  const [authRole, setAuthRole] = useState<"worker" | "viewer" | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: UserRole;
  } | null>(null);

  // kaam detail modal
  const [detailKaam, setDetailKaam] = useState<Kaam | null>(null);

  // worker profile view
  const [profileWorkerId, setProfileWorkerId] = useState<string | null>(null);

  // toast
  const [toast, setToast] = useState<{ msg: string; tone: "success" | "error" | "info" } | null>(null);

  // explore filters
  const [exploreSearch, setExploreSearch] = useState("");
  const [exploreCat, setExploreCat] = useState<string>("all");
  const [exploreCity, setExploreCity] = useState<string>("All Cities");
  const [exploreSort, setExploreSort] = useState<string>("recommended");

  // home search
  const [homeSearch, setHomeSearch] = useState("");

  // post kaam form
  const [postForm, setPostForm] = useState({
    title: "",
    category: "",
    price: "",
    delivery: "3",
    description: "",
  });

  // admin: state-backed users + kaams so they can be deleted
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [kaamsList, setKaamsList] = useState<Kaam[]>(INITIAL_KAAMS);
  const [adminTab, setAdminTab] = useState<"users" | "workers" | "kaam">("users");
  const [adminSearch, setAdminSearch] = useState("");

  // workers are state-backed so admin deletions reflect everywhere (Top Workers, cards, profiles)
  const [workersList, setWorkersList] = useState<Worker[]>(WORKERS);

  // admin auth
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  /* ---------- Derived: filtered kaams for explore ---------- */
  const filteredKaams = useMemo(() => {
    let list = [...kaamsList];
    if (exploreCat !== "all") {
      list = list.filter((k) => k.category === exploreCat);
    }
    if (exploreCity !== "All Cities") {
      list = list.filter((k) => {
        const w = workersList.find((x) => x.id === k.workerId);
        return w?.city === exploreCity;
      });
    }
    const q = exploreSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (k) =>
          k.title.toLowerCase().includes(q) ||
          k.description.toLowerCase().includes(q),
      );
    }
    if (exploreSort === "price-low") list.sort((a, b) => a.price - b.price);
    else if (exploreSort === "price-high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [kaamsList, workersList, exploreCat, exploreCity, exploreSearch, exploreSort]);

  /* ---------- Navigation ---------- */
  const goView = useCallback((v: ViewId) => {
    setView(v);
    setActiveNav(v);
    setProfileWorkerId(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const openWorkerProfile = useCallback((id: string) => {
    setProfileWorkerId(id);
    setView("home");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  /* ---------- Toast ---------- */
  const showToast = useCallback(
    (msg: string, tone: "success" | "error" | "info" = "success") => {
      setToast({ msg, tone });
      window.setTimeout(() => setToast(null), 3200);
    },
    [],
  );

  /* ---------- Auth modal ---------- */
  const openAuth = useCallback(() => {
    setAuthStep("role");
    setAuthRole(null);
    setAuthModal(true);
  }, []);

  const submitAuth = useCallback(() => {
    setCurrentUser({ name: authRole === "admin" ? "Admin" : "User", role: authRole ?? "viewer" });
    setAuthModal(false);
    showToast(
      authRole === "worker"
        ? "Worker account created! You can post kaam now."
        : "Welcome! Find kaam and chat with workers on WhatsApp.",
    );
  }, [authRole, showToast]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    showToast("Logged out successfully.", "info");
    goView("home");
  }, [showToast, goView]);

  /* ---------- Post kaam ---------- */
  const handlePostKaam = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser || currentUser.role !== "worker") {
        showToast("Please create a Worker account first.", "error");
        openAuth();
        return;
      }
      showToast("Kaam posted! It will appear after review.");
      setPostForm({ title: "", category: "", price: "", delivery: "3", description: "" });
      goView("explore");
    },
    [currentUser, showToast, openAuth, goView],
  );

  /* ---------- Admin actions ---------- */
  const deleteKaam = useCallback(
    (id: string) => {
      setKaamsList((prev) => prev.filter((k) => k.id !== id));
      showToast("Kaam deleted.", "error");
    },
    [showToast],
  );

  const deleteUser = useCallback(
    (id: string) => {
      const user = users.find((u) => u.id === id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      // if a worker is removed, also drop their kaam posts and worker profile (Top Workers, cards)
      if (user?.role === "worker") {
        setKaamsList((prev) => prev.filter((k) => k.workerId !== id));
        setWorkersList((prev) => prev.filter((w) => w.id !== id));
      }
      showToast(`Account deleted — ${user?.name ?? "user"}.`, "error");
    },
    [users, showToast],
  );

  const deleteWorker = useCallback(
    (id: string) => {
      const w = workersList.find((x) => x.id === id);
      setWorkersList((prev) => prev.filter((x) => x.id !== id));
      setKaamsList((prev) => prev.filter((k) => k.workerId !== id));
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`Worker removed — ${w?.name ?? "worker"}.`, "error");
    },
    [workersList, showToast],
  );

  /* ---------- Admin auth ---------- */
  const adminLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (adminPassword === ADMIN_PASSWORD) {
        setAdminAuthed(true);
        setAdminError("");
        setAdminPassword("");
        showToast("Admin access granted.", "success");
      } else {
        setAdminError("Incorrect password. Access denied.");
      }
    },
    [adminPassword, showToast],
  );

  const adminLogout = useCallback(() => {
    setAdminAuthed(false);
    setAdminPassword("");
    setAdminError("");
    showToast("Admin panel locked.", "info");
  }, [showToast]);

  /* ---------- Body scroll lock ---------- */
  useEffect(() => {
    const lock = authModal || detailKaam !== null;
    if (lock) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [authModal, detailKaam]);

  /* ---------- ESC closes modals ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (detailKaam) setDetailKaam(null);
        else if (authModal) setAuthModal(false);
        else if (profileWorkerId) setProfileWorkerId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailKaam, authModal, profileWorkerId]);

  const getWorker = useCallback(
    (id: string) => workersList.find((w) => w.id === id),
    [workersList],
  );
  const profileWorker = profileWorkerId ? getWorker(profileWorkerId) : null;
  const detailWorker = detailKaam ? getWorker(detailKaam.workerId) : undefined;

  /* Admin stats */
  const adminStats = useMemo(
    () => ({
      total: users.length,
      workers: workersList.length,
      viewers: users.filter((u) => u.role === "viewer").length,
      kaam: kaamsList.length,
    }),
    [users, kaamsList, workersList],
  );

  const filteredAdminUsers = useMemo(() => {
    const q = adminSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q),
    );
  }, [users, adminSearch]);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950">
      {/* Background grid pattern */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-[0.15]" />

      {/* ===== Desktop top navbar ===== */}
      <header className="sticky top-0 z-40 hidden border-b border-white/5 bg-slate-950/80 backdrop-blur-xl md:block">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" aria-label="Primary navigation">
          <BrandMark onClick={() => goView("home")} />

          <div className="flex items-center gap-1">
            {[
              { id: "home" as ViewId, label: "Home" },
              { id: "explore" as ViewId, label: "Explore Kaam" },
              { id: "workers" as ViewId, label: "Workers" },
            ].map((item) =>
              item.id === "workers" ? (
                <button
                  key={item.id}
                  onClick={() => goView("explore")}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </button>
              ) : (
                <button
                  key={item.id}
                  onClick={() => goView(item.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    activeNav === item.id
                      ? "bg-green-500/10 text-green-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ),
            )}
            <button
              onClick={() => goView("home")}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              How It Works
            </button>
            <button
              onClick={() => goView("admin")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeNav === "admin"
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <iconify-icon icon="mdi:shield-crown" width={16} />
              Admin
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => goView("profile")}
                className="flex items-center gap-2 rounded-lg border border-white/5 bg-slate-900 px-3 py-2 text-sm transition-colors hover:border-white/15"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-green-950">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-slate-200">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={openAuth}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Login
              </button>
            )}
            <button
              onClick={() => (currentUser ? goView("post") : openAuth())}
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-green-950 transition-colors hover:bg-green-400"
            >
              <iconify-icon icon="mdi:plus" width={16} />
              Post Kaam
            </button>
          </div>
        </nav>
      </header>

      {/* ===== Mobile top bar ===== */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <BrandMark onClick={() => goView("home")} />
          {currentUser ? (
            <button
              onClick={() => goView("profile")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-green-950"
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={openAuth}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200"
            >
              Create Account
            </button>
          )}
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main className="relative z-10 flex-1 pb-24 md:pb-10" aria-label="Main content">
        {/* ------------------------------------------------
            VIEW: HOME
            ------------------------------------------------ */}
        {view === "home" && !profileWorker && (
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 px-5 py-12 text-center md:px-12 md:py-20">
              {/* green gradient glow */}
              <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-green-500/30 blur-[100px] animate-pulse-glow" />
              <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-emerald-600/20 blur-[100px]" />

              <div className="relative">
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  <iconify-icon icon="mdi:star-four-points" width={14} />
                  Pakistan&apos;s Biggest Local Freelancing Network
                </span>
                <h1 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                  Pakistani Talent.{" "}
                  <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    World-Class Value.
                  </span>
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 md:text-lg">
                  Offer your kaam or find kaam — everything in PKR.
                </p>
                {/* Visually hidden SEO description for crawlers */}
                <p className="sr-only">
                  Hunar.pk is Pakistan&apos;s biggest local freelancing network. Hire talented
                  workers for logo design, website development, video editing, SEO, content
                  writing, social media management, app development and photography. Chat on
                  WhatsApp and pay in PKR with zero commission.
                </p>

                {/* Search bar */}
                <div className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-2 shadow-2xl backdrop-blur">
                  <span className="pl-2 text-slate-500">
                    <iconify-icon icon="mdi:magnify" width={22} />
                  </span>
                  <input
                    value={homeSearch}
                    onChange={(e) => setHomeSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setExploreSearch(homeSearch);
                        goView("explore");
                      }
                    }}
                    placeholder="Search kaam... (e.g. logo, website, SEO)"
                    aria-label="Search kaam on Hunar.pk"
                    className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setExploreSearch(homeSearch);
                      goView("explore");
                    }}
                    className="shrink-0 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-bold text-green-950 transition-colors hover:bg-green-400 md:px-6"
                  >
                    Search
                  </button>
                </div>

                {/* Stats */}
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3">
                  {[
                    { num: "12K+", label: "Workers", icon: "mdi:account-group" },
                    { num: "45K+", label: "Kaam Posted", icon: "mdi:briefcase" },
                    { num: "8.2Cr", label: "PKR Paid Out", icon: "mdi:cash" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-white/5 bg-slate-900/50 px-3 py-4">
                      <iconify-icon icon={s.icon} width={22} class="mx-auto mb-1 text-green-400" />
                      <div className="text-lg font-extrabold text-white md:text-2xl">{s.num}</div>
                      <div className="text-[10px] text-slate-400 md:text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Categories */}
            <section className="mt-10">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold md:text-2xl">Categories</h2>
                <button
                  onClick={() => goView("explore")}
                  className="flex items-center gap-1 text-xs font-medium text-green-400 hover:text-green-300 md:text-sm"
                >
                  View All
                  <iconify-icon icon="mdi:arrow-right" width={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setExploreCat(c.id);
                      setExploreSearch("");
                      goView("explore");
                    }}
                    className="group flex flex-col items-start rounded-2xl border border-white/5 bg-slate-900/50 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40 hover:shadow-[0_0_24px_-4px_rgba(34,197,94,0.35)]"
                  >
                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400 transition-colors group-hover:bg-green-500/20">
                      <iconify-icon icon={c.icon} width={24} />
                    </span>
                    <h3 className="text-sm font-bold text-white">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.count}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Trending Kaam */}
            <section className="mt-12">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold md:text-2xl">
                  <iconify-icon icon="mdi:fire" width={22} class="text-orange-400" />
                  Trending Kaam
                </h2>
                <button
                  onClick={() => goView("explore")}
                  className="flex items-center gap-1 text-xs font-medium text-green-400 hover:text-green-300 md:text-sm"
                >
                  View All
                  <iconify-icon icon="mdi:arrow-right" width={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {kaamsList.slice(0, 4).map((k) => (
                  <KaamCard key={k.id} kaam={k} worker={getWorker(k.workerId)} onOpen={setDetailKaam} onWorker={openWorkerProfile} />
                ))}
              </div>
            </section>

            {/* Top Workers */}
            <section className="mt-12">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold md:text-2xl">
                  <iconify-icon icon="mdi:crown" width={22} class="text-amber-400" />
                  Top Workers
                </h2>
                <button
                  onClick={() => goView("explore")}
                  className="flex items-center gap-1 text-xs font-medium text-green-400 hover:text-green-300 md:text-sm"
                >
                  View All
                  <iconify-icon icon="mdi:arrow-right" width={16} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 md:max-w-2xl md:gap-4">
                {workersList.slice(0, 3).map((w) => (
                  <WorkerCard key={w.id} worker={w} onOpen={openWorkerProfile} />
                ))}
              </div>
            </section>

            {/* How it works */}
            <section className="mt-12 rounded-3xl border border-white/5 bg-slate-900/40 p-6 md:p-10">
              <h2 className="mb-6 text-center text-lg font-bold md:text-2xl">How It Works</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { icon: "mdi:magnify", title: "1. Find Kaam", desc: "Browse kaam by category or city to find what you need." },
                  { icon: "mdi:whatsapp", title: "2. Chat on WhatsApp", desc: "Message the worker directly on WhatsApp — no commission." },
                  { icon: "mdi:hand-coin", title: "3. Get It Done", desc: "Pay the worker directly, get your work done, and leave a rating." },
                ].map((s) => (
                  <div key={s.title} className="rounded-2xl border border-white/5 bg-slate-950/40 p-5">
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                      <iconify-icon icon={s.icon} width={26} />
                    </span>
                    <h3 className="mb-1 font-bold text-white">{s.title}</h3>
                    <p className="text-sm text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ------------------------------------------------
            VIEW: EXPLORE KAAM
            ------------------------------------------------ */}
        {view === "explore" && !profileWorker && (
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="py-6">
              <h1 className="mb-1 text-2xl font-extrabold md:text-3xl">Explore Kaam</h1>
              <p className="text-sm text-slate-400">
                Browse kaam from Pakistan&apos;s best workers — all in PKR.
              </p>

              {/* Search */}
              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-2">
                <span className="pl-2 text-slate-500">
                  <iconify-icon icon="mdi:magnify" width={20} />
                </span>
                <input
                  value={exploreSearch}
                  onChange={(e) => setExploreSearch(e.target.value)}
                  placeholder="Search kaam..."
                  aria-label="Search kaam listings"
                  className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                {exploreSearch && (
                  <button
                    onClick={() => setExploreSearch("")}
                    className="px-2 text-slate-500 hover:text-white"
                  >
                    <iconify-icon icon="mdi:close" width={18} />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setExploreCat("all")}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    exploreCat === "all"
                      ? "border-green-500 bg-green-500 text-green-950"
                      : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setExploreCat(c.id)}
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                      exploreCat === c.id
                        ? "border-green-500 bg-green-500 text-green-950"
                        : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* City + Sort */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <iconify-icon icon="mdi:map-marker" width={16} />
                  <select
                    value={exploreCity}
                    onChange={(e) => setExploreCity(e.target.value)}
                    className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-white focus:border-green-500 focus:outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <iconify-icon icon="mdi:sort" width={16} />
                  <select
                    value={exploreSort}
                    onChange={(e) => setExploreSort(e.target.value)}
                    className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-white focus:border-green-500 focus:outline-none"
                  >
                    {SORT_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id} className="bg-slate-900">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
                <span className="ml-auto text-xs text-slate-500">{filteredKaams.length} kaam found</span>
              </div>

              {/* Grid */}
              {filteredKaams.length === 0 ? (
                <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
                  <iconify-icon icon="mdi:emoticon-sad-outline" width={48} class="text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">No kaam found</p>
                  <p className="text-xs text-slate-500">Try changing filters or search.</p>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                  {filteredKaams.map((k) => (
                    <KaamCard key={k.id} kaam={k} worker={getWorker(k.workerId)} onOpen={setDetailKaam} onWorker={openWorkerProfile} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------
            VIEW: POST KAAM
            ------------------------------------------------ */}
        {view === "post" && !profileWorker && (
          <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold md:text-3xl">Post Your Kaam</h1>
              <p className="mt-1 text-sm text-slate-400">
                Post your service and let clients contact you directly.
              </p>
            </div>

            {(!currentUser || currentUser.role !== "worker") && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                <iconify-icon icon="mdi:alert-circle-outline" width={22} class="shrink-0 text-amber-400" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-300">Worker account required</p>
                  <p className="mt-0.5 text-amber-200/80">
                    You need a Worker account to post kaam. Fill the form below — submitting will remind you.
                  </p>
                  <button
                    onClick={openAuth}
                    className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-amber-950 hover:bg-amber-400"
                  >
                    <iconify-icon icon="mdi:account-plus" width={14} />
                    Become a Worker
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={handlePostKaam}
              className="space-y-5 rounded-2xl border border-white/5 bg-slate-900/50 p-5 md:p-6"
            >
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Kaam Title</label>
                <input
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="e.g. Logo design in 24 hours"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Category</label>
                <select
                  required
                  value={postForm.category}
                  onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="" className="bg-slate-900">
                    Select category
                  </option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price + Delivery */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Price (PKR)</label>
                  <div className="flex items-center rounded-xl border border-white/10 bg-slate-950/60 px-3 focus-within:border-green-500">
                    <span className="text-sm text-slate-500">Rs.</span>
                    <input
                      required
                      type="number"
                      min="100"
                      value={postForm.price}
                      onChange={(e) => setPostForm({ ...postForm, price: e.target.value })}
                      placeholder="5000"
                      className="w-full bg-transparent px-2 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Delivery Time</label>
                  <select
                    required
                    value={postForm.delivery}
                    onChange={(e) => setPostForm({ ...postForm, delivery: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="1" className="bg-slate-900">
                      1 day
                    </option>
                    <option value="3" className="bg-slate-900">
                      3 days
                    </option>
                    <option value="7" className="bg-slate-900">
                      7 days
                    </option>
                    <option value="15" className="bg-slate-900">
                      15 days
                    </option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
                <textarea
                  required
                  value={postForm.description}
                  onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                  rows={4}
                  placeholder="Describe your kaam... what's included, revisions, etc."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Samples (fake file input) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Upload Samples</label>
                <button
                  type="button"
                  onClick={() => showToast("This is a demo — file upload is not active.", "info")}
                  className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-slate-950/40 py-8 text-center transition-colors hover:border-green-500/40"
                >
                  <iconify-icon icon="mdi:cloud-upload-outline" width={36} class="text-slate-500" />
                  <span className="mt-2 text-sm font-medium text-slate-300">Upload your samples here</span>
                  <span className="mt-0.5 text-xs text-slate-500">PNG, JPG, PDF (max 10MB)</span>
                </button>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-green-950 transition-colors hover:bg-green-400"
              >
                <iconify-icon icon="mdi:rocket-launch" width={18} />
                Post Kaam
              </button>
            </form>
          </div>
        )}

        {/* ------------------------------------------------
            VIEW: PROFILE
            ------------------------------------------------ */}
        {view === "profile" && !profileWorker && (
          <div className="mx-auto max-w-2xl px-4 py-6 md:px-6">
            <h1 className="mb-6 text-2xl font-extrabold md:text-3xl">Profile</h1>

            {currentUser ? (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-6">
                  <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-green-500/20 blur-[70px]" />
                  <div className="relative flex items-center gap-4">
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(currentUser.name)} text-2xl font-bold text-white`}
                    >
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[currentUser.role].badge}`}
                      >
                        <iconify-icon icon={ROLE_STYLES[currentUser.role].icon} width={14} />
                        {ROLE_STYLES[currentUser.role].label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => goView("post")}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-4 text-left transition-colors hover:border-green-500/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                      <iconify-icon icon="mdi:plus-circle" width={22} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-white">Post a Kaam</span>
                      <span className="block text-xs text-slate-400">Offer a new service</span>
                    </span>
                  </button>
                  <button
                    onClick={() => goView("explore")}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-4 text-left transition-colors hover:border-green-500/40"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                      <iconify-icon icon="mdi:compass" width={22} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-white">Explore Kaam</span>
                      <span className="block text-xs text-slate-400">Browse services</span>
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => goView("admin")}
                  className="flex w-full items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-left transition-colors hover:border-amber-500/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                    <iconify-icon icon="mdi:shield-crown" width={22} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-white">Admin Panel</span>
                    <span className="block text-xs text-slate-400">Manage accounts & kaam posts</span>
                  </span>
                  <iconify-icon icon="mdi:chevron-right" width={20} class="ml-auto text-slate-500" />
                </button>

                <button
                  onClick={logout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-3 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <iconify-icon icon="mdi:logout" width={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
                <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                  <iconify-icon icon="mdi:account-circle-outline" width={40} />
                </span>
                <h2 className="text-lg font-bold text-white">You&apos;re not logged in</h2>
                <p className="mt-1 max-w-xs text-sm text-slate-400">
                  Create an account to post kaam or save your favorite workers.
                </p>
                <button
                  onClick={openAuth}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-2.5 text-sm font-bold text-green-950 transition-colors hover:bg-green-400"
                >
                  <iconify-icon icon="mdi:account-plus" width={18} />
                  Create Account
                </button>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------
            VIEW: ADMIN PANEL
            ------------------------------------------------ */}
        {view === "admin" && !profileWorker && (
          <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                <iconify-icon icon="mdi:shield-crown" width={26} />
              </span>
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold md:text-3xl">Admin Panel</h1>
                <p className="text-sm text-slate-400">Manage accounts, workers & kaam posts.</p>
              </div>
              {adminAuthed && (
                <button
                  onClick={adminLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-500/40 hover:text-amber-400"
                  title="Lock admin panel"
                >
                  <iconify-icon icon="mdi:lock" width={16} />
                  <span className="hidden sm:inline">Lock</span>
                </button>
              )}
            </div>

            {!adminAuthed ? (
              <div className="mx-auto max-w-md rounded-3xl border border-white/5 bg-slate-900/50 p-6 text-center md:p-8">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                  <iconify-icon icon="mdi:lock" width={32} />
                </span>
                <h2 className="text-lg font-bold text-white">Admin Access Required</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Enter the admin password to manage accounts, workers and kaam posts.
                </p>
                <form onSubmit={adminLogin} className="mt-5 space-y-3 text-left">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setAdminError("");
                      }}
                      placeholder="Enter admin password"
                      autoFocus
                      aria-label="Admin password"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  {adminError && (
                    <p className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                      <iconify-icon icon="mdi:alert-circle-outline" width={14} />
                      {adminError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-amber-950 transition-colors hover:bg-amber-400"
                  >
                    <iconify-icon icon="mdi:lock-open" width={18} />
                    Unlock Admin Panel
                  </button>
                </form>
                <button
                  onClick={() => goView("home")}
                  className="mt-3 text-xs text-slate-500 hover:text-slate-300"
                >
                  ← Back to home
                </button>
              </div>
            ) : (
              <>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { num: adminStats.total, label: "Total Users", icon: "mdi:account-group", tone: "text-sky-400" },
                { num: adminStats.workers, label: "Workers", icon: "mdi:briefcase", tone: "text-green-400" },
                { num: adminStats.viewers, label: "Viewers", icon: "mdi:account-search", tone: "text-violet-400" },
                { num: adminStats.kaam, label: "Kaam Posts", icon: "mdi:file-multiple", tone: "text-amber-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/5 bg-slate-900/50 p-4">
                  <iconify-icon icon={s.icon} width={22} class={`${s.tone} mb-1`} />
                  <div className="text-2xl font-extrabold text-white">{s.num}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-5 flex gap-2">
              <button
                onClick={() => setAdminTab("users")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  adminTab === "users"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
                }`}
              >
                <iconify-icon icon="mdi:account-group" width={16} class="mr-1.5 align-middle" />
                Users
              </button>
              <button
                onClick={() => setAdminTab("workers")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  adminTab === "workers"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
                }`}
              >
                <iconify-icon icon="mdi:account-tie" width={16} class="mr-1.5 align-middle" />
                Workers
              </button>
              <button
                onClick={() => setAdminTab("kaam")}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  adminTab === "kaam"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
                }`}
              >
                <iconify-icon icon="mdi:file-multiple" width={16} class="mr-1.5 align-middle" />
                Kaam Posts
              </button>
            </div>

            {/* Users management */}
            {adminTab === "users" && (
              <div>
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 p-2">
                  <span className="pl-2 text-slate-500">
                    <iconify-icon icon="mdi:magnify" width={18} />
                  </span>
                  <input
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    placeholder="Search by name or city..."
                    aria-label="Search users in admin panel"
                    className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>

                {filteredAdminUsers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-400">
                    No users found.
                  </div>
                ) : (
                  <div className="hunar-scroll max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                    {filteredAdminUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-3"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(u.name)} text-sm font-bold text-white`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-white">{u.name}</p>
                          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                            <span className="flex items-center gap-0.5">
                              <iconify-icon icon="mdi:map-marker" width={11} />
                              {u.city}
                            </span>
                            <span className="text-slate-600">·</span>
                            <span className="flex items-center gap-0.5">
                              <iconify-icon icon="mdi:phone" width={11} />
                              +{u.phone}
                            </span>
                            {u.level && (
                              <>
                                <span className="text-slate-600">·</span>
                                <span>{u.level}</span>
                              </>
                            )}
                          </p>
                        </div>
                        <span
                          className={`hidden shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline-flex ${ROLE_STYLES[u.role].badge}`}
                        >
                          <iconify-icon icon={ROLE_STYLES[u.role].icon} width={12} />
                          {ROLE_STYLES[u.role].label}
                        </span>
                        <button
                          onClick={() => deleteUser(u.id)}
                          disabled={u.role === "admin"}
                          className="flex shrink-0 items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                          title={u.role === "admin" ? "Admin accounts cannot be deleted" : "Delete account"}
                        >
                          <iconify-icon icon="mdi:trash-can-outline" width={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Workers management */}
            {adminTab === "workers" && (
              <div>
                {workersList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-400">
                    No workers found.
                  </div>
                ) : (
                  <div className="hunar-scroll max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                    {workersList.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-3"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${w.gradient} text-xs font-bold text-white`}
                        >
                          {w.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-white">{w.name}</p>
                          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                            <span className="flex items-center gap-0.5">
                              <iconify-icon icon="mdi:map-marker" width={11} />
                              {w.city}
                            </span>
                            <span className="text-slate-600">·</span>
                            <Stars rating={w.rating} size={11} />
                            <span className="text-slate-300">{w.rating}</span>
                            <span className="text-slate-600">·</span>
                            <span>{w.totalKaam} Kaam</span>
                          </p>
                        </div>
                        <span
                          className={`hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline-block ${LEVEL_STYLES[w.level].badge}`}
                        >
                          {w.level}
                        </span>
                        <button
                          onClick={() => deleteWorker(w.id)}
                          className="flex shrink-0 items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
                        >
                          <iconify-icon icon="mdi:trash-can-outline" width={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Kaam posts management */}
            {adminTab === "kaam" && (
              <div>
                {kaamsList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-slate-400">
                    No kaam posts found.
                  </div>
                ) : (
                  <div className="hunar-scroll max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                    {kaamsList.map((k) => {
                      const w = getWorker(k.workerId);
                      const cat = CATEGORIES.find((c) => c.id === k.category);
                      return (
                        <div
                          key={k.id}
                          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/50 p-3"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                            <iconify-icon icon={cat?.icon ?? "mdi:file"} width={20} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-white">{k.title}</p>
                            <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400">
                              <span>{w?.name ?? "Unknown"}</span>
                              <span className="text-slate-600">·</span>
                              <span>{cat?.name}</span>
                              <span className="text-slate-600">·</span>
                              <span className="font-semibold text-green-400">{formatPKR(k.price)}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => deleteKaam(k.id)}
                            className="flex shrink-0 items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
                          >
                            <iconify-icon icon="mdi:trash-can-outline" width={14} />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            </>
            )}
          </div>
        )}

        {/* ------------------------------------------------
            VIEW: WORKER PROFILE (overlay)
            ------------------------------------------------ */}
        {profileWorker && (
          <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
            <button
              onClick={() => setProfileWorkerId(null)}
              className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
            >
              <iconify-icon icon="mdi:arrow-left" width={18} />
              Back
            </button>

            {/* Profile header */}
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50 p-6 md:p-8">
              <div className="pointer-events-none absolute -top-20 -right-10 h-48 w-48 rounded-full bg-green-500/20 blur-[80px]" />
              <div className="relative flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
                <span
                  className={`mb-4 flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${profileWorker.gradient} text-3xl font-bold text-white ring-4 ${LEVEL_STYLES[profileWorker.level].ring} md:mb-0 md:mr-6`}
                >
                  {profileWorker.initials}
                </span>
                <div className="flex-1">
                  <div className="flex flex-col items-center md:flex-row md:items-center md:gap-3">
                    <h1 className="text-2xl font-extrabold md:text-3xl">{profileWorker.name}</h1>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold md:mt-0 ${LEVEL_STYLES[profileWorker.level].badge}`}
                    >
                      <iconify-icon icon="mdi:medal" width={14} />
                      {profileWorker.level} Worker
                    </span>
                  </div>
                  <p className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-400 md:justify-start">
                    <iconify-icon icon="mdi:map-marker" width={14} />
                    {profileWorker.city}
                    <span className="mx-1 text-slate-600">·</span>
                    <Stars rating={profileWorker.rating} size={14} />
                    <span className="font-semibold text-white">{profileWorker.rating}</span>
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-slate-400 md:mx-0">{profileWorker.bio}</p>

                  {/* Stats */}
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3 text-center">
                      <div className="text-lg font-extrabold text-white">{profileWorker.totalKaam}</div>
                      <div className="text-[10px] text-slate-400">Kaam Done</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3 text-center">
                      <div className="text-lg font-extrabold text-green-400">{profileWorker.rating}</div>
                      <div className="text-[10px] text-slate-400">Rating</div>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3 text-center">
                      <div className="text-lg font-extrabold text-white">{profileWorker.repeatClients}</div>
                      <div className="text-[10px] text-slate-400">Repeat Clients</div>
                    </div>
                  </div>

                  <a
                    href={waLink(profileWorker.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-green-950 transition-colors hover:bg-green-400 md:w-auto"
                  >
                    <iconify-icon icon="mdi:whatsapp" width={20} />
                    Hire Me
                  </a>
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <section className="mt-8">
              <h2 className="mb-4 text-lg font-bold md:text-xl">Portfolio</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                {profileWorker.portfolio.map((g, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-xl border border-white/5">
                    <GradientImage gKey={g} icon={PORTFOLIO_ICONS[g]} className="h-full w-full" />
                  </div>
                ))}
              </div>
            </section>

            {/* More Kaam */}
            <section className="mt-8">
              <h2 className="mb-4 text-lg font-bold md:text-xl">More Kaam</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {kaamsList
                  .filter((k) => k.workerId === profileWorker.id)
                  .map((k) => (
                    <KaamCard key={k.id} kaam={k} worker={getWorker(k.workerId)} onOpen={setDetailKaam} onWorker={openWorkerProfile} />
                  ))}
                {kaamsList.filter((k) => k.workerId === profileWorker.id).length === 0 && (
                  <p className="col-span-full text-sm text-slate-400">This worker has no other kaam yet.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 mt-auto border-t border-white/5 bg-slate-950/80 px-4 py-6 pb-24 md:px-6 md:pb-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-display font-extrabold">
              Hunar<span className="text-green-400">.pk</span>
            </span>
            <span className="text-xs text-slate-500">· Pakistani Talent. World-Class Value.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <button onClick={() => goView("home")} className="hover:text-slate-300">
              About
            </button>
            <button onClick={() => goView("home")} className="hover:text-slate-300">
              Contact
            </button>
            <button onClick={() => goView("admin")} className="flex items-center gap-1 hover:text-amber-400">
              <iconify-icon icon="mdi:shield-crown" width={13} />
              Admin
            </button>
            <button onClick={() => goView("home")} className="hover:text-slate-300">
              Terms
            </button>
            <button onClick={() => goView("home")} className="hover:text-slate-300">
              Privacy
            </button>
          </div>
        </div>
      </footer>

      {/* ===== Mobile bottom nav ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-slate-950/95 backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
        <div className="grid grid-cols-4">
          {[
            { id: "home" as ViewId, label: "Home", icon: "mdi:home" },
            { id: "explore" as ViewId, label: "Explore", icon: "mdi:compass" },
            { id: "post" as ViewId, label: "Post Kaam", icon: "mdi:plus-circle" },
            { id: "profile" as ViewId, label: "Profile", icon: "mdi:account" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "profile") {
                  goView("profile");
                  return;
                }
                goView(item.id);
              }}
              className={`flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                activeNav === item.id ? "text-green-400" : "text-slate-500"
              }`}
            >
              <iconify-icon icon={item.icon} width={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ===== Auth Modal ===== */}
      {authModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-4"
          onClick={() => setAuthModal(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-t-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl animate-slide-up md:rounded-3xl md:animate-scale-in"
          >
            <button
              onClick={() => setAuthModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <iconify-icon icon="mdi:close" width={22} />
            </button>

            <div className="mb-5 text-center">
              <Logo size={56} />
              <h2 className="mt-3 text-xl font-extrabold">Create Account</h2>
              <p className="mt-1 text-sm text-slate-400">Welcome to Hunar.pk. Choose your role.</p>
            </div>

            {authStep === "role" ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setAuthRole("worker");
                    setAuthStep("form");
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    authRole === "worker"
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/10 bg-slate-950/40 hover:border-white/20"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
                    <iconify-icon icon="mdi:briefcase" width={24} />
                  </span>
                  <span>
                    <span className="block font-bold text-white">Worker</span>
                    <span className="block text-xs text-slate-400">I provide kaam — post my services</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setAuthRole("viewer");
                    setAuthStep("form");
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    authRole === "viewer"
                      ? "border-green-500 bg-green-500/10"
                      : "border-white/10 bg-slate-950/40 hover:border-white/20"
                  }`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                    <iconify-icon icon="mdi:account-search" width={24} />
                  </span>
                  <span>
                    <span className="block font-bold text-white">Viewer</span>
                    <span className="block text-xs text-slate-400">I need kaam — find and hire workers</span>
                  </span>
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitAuth();
                }}
                className="space-y-4"
              >
                <div className="mb-2 flex items-center gap-2 rounded-lg border border-white/5 bg-slate-950/40 px-3 py-2 text-xs">
                  <iconify-icon
                    icon={authRole === "worker" ? "mdi:briefcase" : "mdi:account-search"}
                    width={16}
                    class="text-green-400"
                  />
                  <span className="text-slate-300">
                    Role:{" "}
                    <span className="font-semibold text-white">
                      {authRole === "worker" ? "Worker" : "Viewer"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAuthStep("role")}
                    className="ml-auto text-green-400 hover:text-green-300"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Name</label>
                  <input
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Phone</label>
                  <input
                    required
                    type="tel"
                    placeholder="03XX XXXXXXX"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">City</label>
                  <select
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="" className="bg-slate-900">
                      Select city
                    </option>
                    {CITIES.filter((c) => c !== "All Cities").map((c) => (
                      <option key={c} value={c} className="bg-slate-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-green-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-green-950 transition-colors hover:bg-green-400"
                >
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===== Kaam Detail Modal ===== */}
      {detailKaam && detailWorker && (
        <KaamDetailModal
          kaam={detailKaam}
          worker={detailWorker}
          onClose={() => setDetailKaam(null)}
          onWorker={openWorkerProfile}
        />
      )}

      {/* ===== Toast ===== */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 md:bottom-6">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 shadow-2xl animate-toast-in">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                toast.tone === "error"
                  ? "bg-red-500/15 text-red-400"
                  : toast.tone === "info"
                    ? "bg-sky-500/15 text-sky-400"
                    : "bg-green-500/15 text-green-400"
              }`}
            >
              <iconify-icon
                icon={
                  toast.tone === "error"
                    ? "mdi:alert-circle"
                    : toast.tone === "info"
                      ? "mdi:information"
                      : "mdi:check-circle"
                }
                width={22}
              />
            </span>
            <p className="flex-1 text-sm font-medium text-white">{toast.msg}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
              <iconify-icon icon="mdi:close" width={18} />
            </button>
          </div>
        </div>
      )}

      {/* bg-grid pattern style */}
      <style>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   KaamDetailModal
   ============================================================ */
function KaamDetailModal({
  kaam,
  worker,
  onClose,
  onWorker,
}: {
  kaam: Kaam;
  worker: Worker;
  onClose: () => void;
  onWorker: (id: string) => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === kaam.category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="hunar-scroll relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-slate-900 shadow-2xl animate-slide-up md:rounded-3xl md:animate-scale-in"
      >
        {/* Header image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-3xl">
          <GradientImage gKey={kaam.image} icon={cat?.icon} className="h-full w-full" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
          >
            <iconify-icon icon="mdi:close" width={20} />
          </button>
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {cat?.name}
          </span>
        </div>

        <div className="p-5 md:p-6">
          {/* Worker row */}
          <button
            onClick={() => {
              onClose();
              onWorker(worker.id);
            }}
            className="mb-4 flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-3 text-left transition-colors hover:border-green-500/30"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${worker.gradient} text-sm font-bold text-white`}
            >
              {worker.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-white">{worker.name}</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <iconify-icon icon="mdi:map-marker" width={12} />
                {worker.city}
                <span className="mx-1 text-slate-600">·</span>
                <Stars rating={worker.rating} size={12} />
                {worker.rating}
              </span>
            </span>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${LEVEL_STYLES[worker.level].badge}`}
            >
              {worker.level}
            </span>
          </button>

          {/* Title + price */}
          <h2 className="text-xl font-extrabold text-white md:text-2xl">{kaam.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
            <span className="text-2xl font-extrabold text-green-400">{formatPKR(kaam.price)}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <iconify-icon icon="mdi:clock-outline" width={16} />
              {deliveryLabel(kaam.deliveryDays)}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Stars rating={kaam.rating} size={14} />
              <span className="font-semibold text-white">{kaam.rating}</span>
              <span className="text-slate-500">({kaam.reviews} reviews)</span>
            </span>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-bold text-white">Details</h3>
            <p className="text-sm leading-relaxed text-slate-300">{kaam.description}</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {[
                "Source files included",
                "Unlimited revisions",
                "Guaranteed delivery",
                "Discuss payment on WhatsApp",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <iconify-icon icon="mdi:check-circle" width={16} class="text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Sample images */}
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-bold text-white">Samples</h3>
            <div className="grid grid-cols-3 gap-2">
              {[kaam.image, "g2", "g3"].map((g, i) => (
                <div key={i} className="aspect-video overflow-hidden rounded-lg border border-white/5">
                  <GradientImage gKey={g} icon={cat?.icon} className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href={waLink(worker.phone, kaam.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 text-base font-bold text-green-950 transition-colors hover:bg-green-400"
          >
            <iconify-icon icon="mdi:whatsapp" width={22} />
            WhatsApp Chat
          </a>
          <p className="mt-2 text-center text-xs text-slate-500">
            Chat directly with the worker on WhatsApp. No commission.
          </p>
        </div>
      </div>
    </div>
  );
}
