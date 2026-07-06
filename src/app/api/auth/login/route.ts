import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { toUserDTO } from "@/lib/types";

/* POST /api/auth/login
 * Body: { phone, password }
 * Validates credentials, sets session cookie.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone and password are required." }, { status: 400 });
    }

    // Find user by phone, then fetch linked worker (if any) in a follow-up query.
    const { data: user, error: uErr } = await supabase
      .from("User")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();
    if (uErr) {
      throw new Error(uErr.message);
    }
    if (!user) {
      return NextResponse.json({ error: "No account found with this phone. Please register first." }, { status: 404 });
    }
    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    // Fetch linked worker (if any) to enrich the response with level/workerId
    let worker: { id: string; level: string } | null = null;
    const { data: w, error: wErr } = await supabase
      .from("Worker")
      .select("id, level")
      .eq("userId", user.id)
      .maybeSingle();
    if (wErr) {
      throw new Error(wErr.message);
    }
    worker = w;

    await setSessionCookie({ uid: user.id, role: user.role, name: user.name });

    const dto = toUserDTO(user);
    return NextResponse.json({
      user: { ...dto, level: worker?.level ?? null },
      workerId: worker?.id ?? null,
    });
  } catch (e) {
    console.error("[login] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Login failed. Please try again.", detail: msg }, { status: 500 });
  }
}
