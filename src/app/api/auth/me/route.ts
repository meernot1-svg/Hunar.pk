import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { toUserDTO } from "@/lib/types";

/* GET /api/auth/me — returns the currently logged-in user (or null). */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ user: null });

    const { data: user, error: uErr } = await supabase
      .from("User")
      .select("*")
      .eq("id", session.uid)
      .maybeSingle();
    if (uErr) {
      console.error("[me] error:", uErr.message);
      return NextResponse.json({ user: null });
    }
    if (!user) return NextResponse.json({ user: null });

    // Fetch linked worker to enrich the response with level/workerId
    const { data: worker } = await supabase
      .from("Worker")
      .select("id, level")
      .eq("userId", user.id)
      .maybeSingle();

    const dto = toUserDTO(user);
    return NextResponse.json({
      user: { ...dto, level: worker?.level ?? null },
      workerId: worker?.id ?? null,
    });
  } catch (e) {
    console.error("[me] error:", e);
    return NextResponse.json({ user: null });
  }
}
