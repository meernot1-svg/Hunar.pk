/* ============================================================
   Hunar.pk — Image upload utilities (Vercel/Supabase-ready)
   ------------------------------------------------------------
   Images are converted to base64 data URLs and stored directly
   in the database (Kaam.thumbnail / Kaam.samples). This makes
   the app fully portable:
     - Works locally (SQLite)
     - Works on Railway (Postgres)
     - Works on Vercel (Supabase) — no ephemeral filesystem issues
     - No external bucket service (Cloudinary/S3) required

   Trade-off: base64 inflates size ~33%. We cap uploads at 1.5MB
   to keep DB rows reasonable. Supabase free tier (500MB) easily
   holds thousands of thumbnails.
   ============================================================ */

const MAX_SIZE = 1.5 * 1024 * 1024; // 1.5 MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

export function isAllowedImage(file: File): boolean {
  return ALLOWED.has(file.type.toLowerCase());
}

export function isUnderSizeLimit(file: File): boolean {
  return file.size <= MAX_SIZE;
}

/**
 * Validate + convert an uploaded image to a base64 data URL.
 * Returns a string like "data:image/png;base64,iVBORw0KG..." which
 * can be stored in the DB and used directly in <img src="...">.
 *
 * Server-side: uses File.arrayBuffer() + Buffer.toString("base64"),
 * which works in Next.js Route Handlers on Node.js 18+.
 */
export async function saveUploadedImage(file: File): Promise<string> {
  if (!isAllowedImage(file)) {
    throw new Error("Only PNG, JPG, WEBP, or GIF images are allowed.");
  }
  if (!isUnderSizeLimit(file)) {
    throw new Error("Image too large (max 1.5MB).");
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}

/** Validate + convert multiple uploaded images to base64 data URLs. */
export async function saveUploadedImageList(files: File[]): Promise<string[]> {
  const out: string[] = [];
  for (const f of files) {
    out.push(await saveUploadedImage(f));
  }
  return out;
}
