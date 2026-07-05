import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

/* POST /api/auth/logout — clears the session cookie. */
export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[logout] error:", e);
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}
