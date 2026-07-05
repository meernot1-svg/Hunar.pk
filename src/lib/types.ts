/* ============================================================
   Hunar.pk — Shared API types
   Used by both API route handlers and the frontend client.
   ============================================================ */

export type WorkerLevel = "New" | "Rising" | "Top";
export type UserRole = "worker" | "viewer" | "admin";

export interface WorkerDTO {
  id: string;
  userId: string;
  name: string;
  city: string;
  level: WorkerLevel;
  rating: number;
  totalKaam: number;
  repeatClients: number;
  gradient: string;
  initials: string;
  phone: string;
  bio: string;
  portfolio: string[]; // gradient keys (or could be URLs in future)
}

export interface KaamDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: 1 | 3 | 7 | 15;
  category: string;
  workerId: string;
  rating: number;
  reviews: number;
  image: string; // gradient fallback key
  thumbnail?: string | null; // uploaded thumbnail URL
  samples?: string[] | null; // uploaded sample image URLs
}

export interface UserAccountDTO {
  id: string;
  name: string;
  role: UserRole;
  city: string;
  phone: string;
  level?: WorkerLevel | null;
  joined: string;
}

/* What the session returns (no password hash) */
export type SessionUserDTO = UserAccountDTO;

/* Admin password (server-side constant, NOT shipped to client) */
export const ADMIN_PANEL_PASSWORD = "BA56CR7VK18";

/* Helper: convert a Prisma Worker row → WorkerDTO */
export function toWorkerDTO(w: {
  id: string;
  userId: string;
  name: string;
  city: string;
  level: string;
  rating: number;
  totalKaam: number;
  repeatClients: number;
  gradient: string;
  initials: string;
  phone: string;
  bio: string;
  portfolio: string;
}): WorkerDTO {
  let portfolio: string[] = [];
  try {
    portfolio = JSON.parse(w.portfolio) as string[];
  } catch {
    portfolio = [];
  }
  return {
    id: w.id,
    userId: w.userId,
    name: w.name,
    city: w.city,
    level: w.level as WorkerLevel,
    rating: w.rating,
    totalKaam: w.totalKaam,
    repeatClients: w.repeatClients,
    gradient: w.gradient,
    initials: w.initials,
    phone: w.phone,
    bio: w.bio,
    portfolio,
  };
}

/* Helper: convert a Prisma Kaam row → KaamDTO */
export function toKaamDTO(k: {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  category: string;
  workerId: string;
  rating: number;
  reviews: number;
  image: string;
  thumbnail: string | null;
  samples: string | null;
}): KaamDTO {
  let samples: string[] | null = null;
  if (k.samples) {
    try {
      samples = JSON.parse(k.samples) as string[];
    } catch {
      samples = null;
    }
  }
  return {
    id: k.id,
    title: k.title,
    description: k.description,
    price: k.price,
    deliveryDays: k.deliveryDays as 1 | 3 | 7 | 15,
    category: k.category,
    workerId: k.workerId,
    rating: k.rating,
    reviews: k.reviews,
    image: k.image,
    thumbnail: k.thumbnail ?? null,
    samples,
  };
}

/* Helper: convert a Prisma User row → UserAccountDTO */
export function toUserDTO(u: {
  id: string;
  name: string;
  role: string;
  city: string;
  phone: string;
  joined: string;
}): UserAccountDTO {
  return {
    id: u.id,
    name: u.name,
    role: u.role as UserRole,
    city: u.city,
    phone: u.phone,
    joined: u.joined,
  };
}
