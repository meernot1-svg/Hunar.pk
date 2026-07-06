import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { authorizeAdmin } from "@/lib/auth";

/* DELETE /api/admin/users/[id] — admin only.
 * - Cannot delete admin accounts.
 * - Deleting a user cascades to their worker profile + kaam posts (per schema).
 *   Supabase REST API relies on FK ON DELETE CASCADE at the DB level.
 *   If for any reason the cascade does not fire, we manually clean up:
 *   Kaams → Worker → User.
 */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const { id } = await ctx.params;

    const { data: user, error: uErr } = await supabase
      .from("User")
      .select("id, role")
      .eq("id", id)
      .maybeSingle();
    if (uErr) {
      throw new Error(uErr.message);
    }
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (user.role === "admin") {
      return NextResponse.json({ error: "Admin accounts cannot be deleted." }, { status: 400 });
    }

    // Deleting the user should cascade to Worker + Kaam (schema onDelete: Cascade).
    const { error: delErr } = await supabase.from("User").delete().eq("id", id);
    if (delErr) {
      throw new Error(delErr.message);
    }

    // Verify cleanup; if a worker row is still hanging around, remove manually.
    const { data: leftover } = await supabase
      .from("Worker")
      .select("id")
      .eq("userId", id)
      .maybeSingle();
    if (leftover) {
      // Manually cascade: kaams for this worker → worker row.
      await supabase.from("Kaam").delete().eq("workerId", leftover.id);
      await supabase.from("Worker").delete().eq("id", leftover.id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin user DELETE] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to delete user.", detail: msg }, { status: 500 });
  }
}
