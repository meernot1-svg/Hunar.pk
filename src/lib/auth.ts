import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/* ============================================================
   Hunar.pk — Auth utilities
   - Password hashing (bcrypt)
   - Signed JWT session cookie (httpOnly, SameSite=Lax)
   ============================================================ */

const SESSION_COOKIE = "hunar_session";
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days (seconds)
const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ||
    // dev fallback — always set AUTH_SECRET in production
    "hunar-pk-dev-secret-change-me-please-0123456789",
);

export interface SessionPayload {
  uid: string; // user id
  role: string; // worker | viewer | admin
  name: string;
}

/* ---------- Password hashing ---------- */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/* ---------- JWT session ---------- */
export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (
      typeof payload.uid === "string" &&
      typeof payload.role === "string" &&
      typeof payload.name === "string"
    ) {
      return { uid: payload.uid, role: payload.role, name: payload.name };
    }
    return null;
  } catch {
    return null;
  }
}

/* ---------- Cookie helpers (server-side, for Route Handlers) ---------- */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/* ---------- Admin panel access (separate from user session) ----------
 * The admin panel is gated by the ADMIN_PANEL_PASSWORD (see types.ts).
 * Verifying it sets a short-lived signed cookie so subsequent admin API
 * calls (list/delete users, delete workers) can be authorized without
 * requiring the visitor to be logged in as an admin *user*.
 */
const ADMIN_COOKIE = "hunar_admin";
const ADMIN_TTL = 60 * 60 * 4; // 4 hours

export async function setAdminCookie(): Promise<void> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_TTL}s`)
    .sign(SECRET);
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_TTL,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

/* Authorize an admin action: either the logged-in user is an admin,
 * OR the visitor has the admin-panel cookie (verified password). */
export async function authorizeAdmin(): Promise<boolean> {
  const session = await getSession();
  if (session?.role === "admin") return true;
  return isAdminAuthed();
}
