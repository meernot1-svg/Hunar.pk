import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

/* ============================================================
   Hunar.pk — File upload utilities
   Saves uploaded images to /public/uploads and returns the
   publicly-served URL path (e.g. /uploads/abc123.png).
   ============================================================ */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]);

export function isAllowedImage(file: File): boolean {
  return ALLOWED.has(file.type.toLowerCase());
}

export function isUnderSizeLimit(file: File): boolean {
  return file.size <= MAX_SIZE;
}

/**
 * Save an uploaded image file to /public/uploads.
 * Returns the URL path that can be served from /uploads/...
 */
export async function saveUploadedImage(file: File): Promise<string> {
  if (!isAllowedImage(file)) {
    throw new Error("Only PNG, JPG, WEBP, or GIF images are allowed.");
  }
  if (!isUnderSizeLimit(file)) {
    throw new Error("Image too large (max 2MB).");
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  // Build a unique filename: <random>-<timestamp>.<ext>
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const id = crypto.randomBytes(10).toString("hex");
  const filename = `${id}-${Date.now()}.${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();
  await fs.writeFile(filepath, Buffer.from(bytes));

  return `/uploads/${filename}`;
}

/**
 * Save multiple uploaded image files. Returns array of URL paths.
 * Stops on first error.
 */
export async function saveUploadedImageList(files: File[]): Promise<string[]> {
  const out: string[] = [];
  for (const f of files) {
    out.push(await saveUploadedImage(f));
  }
  return out;
}
