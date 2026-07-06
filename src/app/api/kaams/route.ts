import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { toKaamDTO, toWorkerDTO } from "@/lib/types";

/* GET /api/kaams
 * Query params: ?category=&city=&search=&sort=&limit=
 * Returns: { kaams: [{...kaam, worker: WorkerDTO}], total }
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "all";
    const city = url.searchParams.get("city") || "All Cities";
    const search = url.searchParams.get("search")?.trim().toLowerCase() || "";
    const sort = url.searchParams.get("sort") || "recommended";
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? Math.min(200, parseInt(limitParam, 10) || 200) : 200;

    // Step 1: Get kaams (newest first)
    const { data: kaamRows, error } = await supabase
      .from("Kaam")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    const rows = kaamRows ?? [];

    // Step 2: Get unique worker IDs and fetch workers in a single query
    const workerIds = [...new Set(rows.map((k) => k.workerId).filter(Boolean))];
    const workerMap = new Map<string, ReturnType<typeof toWorkerDTO>>();

    if (workerIds.length > 0) {
      const { data: workerRows, error: wErr } = await supabase
        .from("Worker")
        .select("*")
        .in("id", workerIds);
      if (wErr) {
        throw new Error(wErr.message);
      }
      for (const w of workerRows ?? []) {
        workerMap.set(w.id, toWorkerDTO(w));
      }
    }

    // Step 3: Merge worker info into kaam rows, then filter
    const merged = rows.map((k) => ({
      ...k,
      worker: workerMap.get(k.workerId) ?? null,
    }));

    let filtered = merged;
    if (category !== "all") filtered = filtered.filter((k) => k.category === category);
    if (city !== "All Cities") filtered = filtered.filter((k) => k.worker?.city === city);
    if (search) {
      filtered = filtered.filter(
        (k) =>
          k.title.toLowerCase().includes(search) ||
          k.description.toLowerCase().includes(search),
      );
    }

    if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
    // "recommended" — keep newest-first ordering

    const kaams = filtered.map((k) => ({
      ...toKaamDTO(k),
      worker: k.worker,
    }));

    return NextResponse.json({ kaams, total: kaams.length });
  } catch (e) {
    console.error("[kaams GET] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to load kaams.", detail: msg }, { status: 500 });
  }
}

/* POST /api/kaams
 * Body: { title, category, price, deliveryDays, description, thumbnail?, samples? }
 * Requires: logged-in worker account.
 */
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in to post kaam." }, { status: 401 });
    }
    if (session.role !== "worker") {
      return NextResponse.json({ error: "Only worker accounts can post kaam." }, { status: 403 });
    }

    const body = await req.json();
    const title = String(body.title ?? "").trim();
    const category = String(body.category ?? "").trim();
    const price = Number(body.price);
    const deliveryDays = Number(body.deliveryDays);
    const description = String(body.description ?? "").trim();
    const thumbnail = body.thumbnail ? String(body.thumbnail) : null;
    const samplesRaw: unknown = body.samples;

    if (!title || !category || !description) {
      return NextResponse.json({ error: "Title, category and description are required." }, { status: 400 });
    }
    if (!Number.isFinite(price) || price < 100) {
      return NextResponse.json({ error: "Price must be at least Rs. 100." }, { status: 400 });
    }
    if (![1, 3, 7, 15].includes(deliveryDays)) {
      return NextResponse.json({ error: "Invalid delivery time." }, { status: 400 });
    }

    // Find the worker profile linked to this user
    const { data: worker, error: wErr } = await supabase
      .from("Worker")
      .select("*")
      .eq("userId", session.uid)
      .maybeSingle();
    if (wErr) {
      throw new Error(wErr.message);
    }
    if (!worker) {
      return NextResponse.json({ error: "Worker profile not found." }, { status: 404 });
    }

    let samplesJson: string | null = null;
    if (Array.isArray(samplesRaw) && samplesRaw.length > 0) {
      const clean = samplesRaw.filter((s): s is string => typeof s === "string" && s.length > 0);
      samplesJson = JSON.stringify(clean);
    }

    // Insert kaam and return the created row
    const { data: created, error: insertErr } = await supabase
      .from("Kaam")
      .insert({
        title,
        description,
        price,
        deliveryDays,
        category,
        workerId: worker.id,
        rating: 5,
        reviews: 0,
        image: "g1", // gradient fallback
        thumbnail,
        samples: samplesJson,
      })
      .select("*")
      .single();
    if (insertErr) {
      throw new Error(insertErr.message);
    }

    // Bump worker totalKaam (read-then-write; race conditions acceptable at this scale)
    const newTotal = (worker.totalKaam ?? 0) + 1;
    const { error: updateErr } = await supabase
      .from("Worker")
      .update({ totalKaam: newTotal })
      .eq("id", worker.id);
    if (updateErr) {
      console.error("[kaams POST] failed to bump totalKaam:", updateErr.message);
    }

    return NextResponse.json({ kaam: toKaamDTO(created) });
  } catch (e) {
    console.error("[kaams POST] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to post kaam.", detail: msg }, { status: 500 });
  }
}
