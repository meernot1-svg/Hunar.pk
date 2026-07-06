import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { authorizeAdmin } from "@/lib/auth";
import { toUserDTO } from "@/lib/types";

/* GET /api/admin/users — admin only.
 * Returns: { users: UserAccountDTO[] }
 */
export async function GET() {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }

    const { data: rows, error: uErr } = await supabase
      .from("User")
      .select("*")
      .order("createdAt", { ascending: false });
    if (uErr) {
      throw new Error(uErr.message);
    }

    const users = (rows ?? []).map((u) => ({
      ...toUserDTO(u),
      level: u.role === "worker" ? ("New" as const) : null, // workers may be overridden below
    }));

    // Enrich: pull actual worker level where applicable
    const { data: workers, error: wErr } = await supabase
      .from("Worker")
      .select("userId, level");
    if (wErr) {
      throw new Error(wErr.message);
    }
    const levelByUserId = new Map((workers ?? []).map((w) => [w.userId, w.level]));
    const enriched = users.map((u) => ({
      ...u,
      level: levelByUserId.get(u.id) ?? u.level ?? null,
    }));

    return NextResponse.json({ users: enriched });
  } catch (e) {
    console.error("[admin users GET] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to load users.", detail: msg }, { status: 500 });
  }
}
