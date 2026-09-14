"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

export type UploadResult = { url: string; error?: undefined } | { url?: undefined; error: string };

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_BYTES = 40 * 1024 * 1024; // 40MB — short preview clips only
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

function randomId() {
  // crypto.randomUUID is available in the Node/Edge runtimes Next.js Server
  // Actions run in — no extra dependency needed.
  return crypto.randomUUID();
}

export async function uploadGameImage(formData: FormData): Promise<UploadResult> {
  // Re-checked here (not just trusted from the page that rendered the
  // upload widget) for the same reason every other admin action does this:
  // Server Actions are independently callable, so each one must enforce
  // its own authorization.
  await requireAdmin();

  const file = formData.get("file");
  const kind = String(formData.get("kind") ?? "covers");

  if (!(file instanceof File)) {
    return { error: "No file received." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Please upload a JPG, PNG, WebP, AVIF, GIF image or an MP4/WebM video." };
  }
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return {
      error: isVideo
        ? "Video is too large — please keep it under 40MB (a short clip works best)."
        : "Image is too large — please keep it under 20MB.",
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${kind}/${randomId()}.${extension}`;

  const supabase = await createClient();
  const { error: uploadError } = await supabase.storage
    .from("games")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: "Upload failed. Please try again." };
  }

  const { data } = supabase.storage.from("games").getPublicUrl(path);
  return { url: data.publicUrl };
}
