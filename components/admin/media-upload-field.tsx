"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X, AlertCircle, Film } from "lucide-react";
import { toast } from "sonner";
import { cn, isVideoUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_BYTES = 40 * 1024 * 1024; // 40MB — short preview clips only
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

export function MediaUploadField({
  name,
  label,
  hint,
  kind,
  defaultValue,
}: {
  name: string;
  label: string;
  hint?: string;
  kind: "covers" | "banners";
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [isVideo, setIsVideo] = useState(() => isVideoUrl(defaultValue));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = "Please upload a JPG, PNG, WebP, AVIF, GIF image or an MP4/WebM video.";
      setError(msg);
      toast.error(msg);
      return;
    }
    const fileIsVideo = file.type.startsWith("video/");
    const maxBytes = fileIsVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      const msg = fileIsVideo
        ? "Video is too large — please keep it under 40MB (a short clip works best)."
        : "Image is too large — please keep it under 20MB.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setPending(true);
    try {
      // Uploaded directly from the browser to Supabase Storage — not
      // through a Server Action. Vercel's serverless functions cap request
      // bodies at 4.5MB regardless of any Next.js config, which silently
      // breaks larger file uploads in production even though it works
      // locally. Going straight to Supabase from the browser sidesteps
      // that limit entirely; the RLS policies on the `games` bucket (see
      // supabase/schema.sql) are what actually authorize this as an
      // admin-only write, the same as every other admin action.
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${kind}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("games")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        const msg = "Upload failed. Please try again.";
        setError(msg);
        toast.error(msg);
        return;
      }

      const { data } = supabase.storage.from("games").getPublicUrl(path);
      setUrl(data.publicUrl);
      setIsVideo(fileIsVideo);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary">{label}</label>
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {url ? (
        <div className="relative overflow-hidden rounded-xl border border-border-glass-strong bg-surface">
          {isVideo ? (
            <video
              src={url}
              className="h-32 w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              onError={() => setError("Couldn't load the uploaded video preview.")}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded image, not a static asset
            <img
              src={url}
              alt=""
              className="h-32 w-full object-cover"
              onError={() => setError("Couldn't load the uploaded image preview.")}
            />
          )}
          {isVideo && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium text-white">
              <Film size={11} /> Video
            </span>
          )}
          <button
            type="button"
            onClick={() => setUrl("")}
            aria-label="Remove media"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X size={14} />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white hover:bg-black/80"
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          disabled={pending}
          className={cn(
            "flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm transition-colors",
            dragOver
              ? "border-accent-cyan/60 bg-accent-cyan/5 text-accent-cyan"
              : "border-border-glass-strong text-text-muted hover:border-accent-cyan/40 hover:text-text-secondary"
          )}
        >
          {pending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus size={18} />
              Click or drag an image, GIF or video here
            </>
          )}
        </button>
      )}

      {error && (
        <span className="flex items-center gap-1.5 text-xs text-danger">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
      {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
    </div>
  );
}
