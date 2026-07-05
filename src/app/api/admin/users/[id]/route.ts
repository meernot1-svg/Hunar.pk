import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";

/* DELETE /api/admin/users/[id] — admin only.
 * - Cannot delete admin accounts.
 * - Deleting a user cascades to their worker profile + kaam posts (per schema).
 */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const { id } = await ctx.params;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (user.role === "admin") {
      return NextResponse.json({ error: "Admin accounts cannot be deleted." }, { status: 400 });
    }

    // Deleting the user cascades to Worker + Kaam (schema onDelete: Cascade)
    await db.user.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin user DELETE] error:", e);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
