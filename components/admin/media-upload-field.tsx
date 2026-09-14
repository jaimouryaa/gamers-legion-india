"use client";

import { useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, X, AlertCircle, Film } from "lucide-react";
import { toast } from "sonner";
import { cn, isVideoUrl } from "@/lib/utils";
import { uploadGameImage } from "@/app/admin/(protected)/games/upload-action";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime";

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
  // Tracks whether the CURRENT `url` is a video, for preview purposes.
  // Seeded from the URL's extension for an existing value (edit mode);
  // updated from the actual File's type right after a fresh upload, since
  // that's more reliable than waiting to re-derive it from the URL.
  const [isVideo, setIsVideo] = useState(() => isVideoUrl(defaultValue));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const fileIsVideo = file.type.startsWith("video/");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("kind", kind);
      const result = await uploadGameImage(formData);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setUrl(result.url ?? "");
      setIsVideo(fileIsVideo);
    });
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
