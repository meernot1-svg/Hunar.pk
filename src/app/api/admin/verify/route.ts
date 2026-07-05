import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";
import { ADMIN_PANEL_PASSWORD } from "@/lib/types";

/* POST /api/admin/verify
 * Body: { password }
 * Verifies the admin panel password server-side (password is NOT shipped to the client).
 * On success, sets a short-lived signed admin cookie that authorizes admin API calls.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = String(body.password ?? "");
    if (password === ADMIN_PANEL_PASSWORD) {
      await setAdminCookie();
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Incorrect password. Access denied." }, { status: 401 });
  } catch (e) {
    console.error("[admin verify] error:", e);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
