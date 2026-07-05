import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";

/* POST /api/admin/logout — clears the admin panel cookie. */
export async function POST() {
  try {
    await clearAdminCookie();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin logout] error:", e);
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}
