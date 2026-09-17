"use client";

import { useEffect, useRef, useState } from "react";
import { cn, isVideoUrl } from "@/lib/utils";

// Deterministic gradient placeholder art for a game cover. We never fetch or
// reproduce real publisher box art (copyrighted) — this generates distinct,
// premium-feeling art per title using a hash of the title + genre.
const PALETTES = [
  ["#0ea5c7", "#1e293b", "#7c3aed"],
  ["#e14bd6", "#1c1032", "#35e0ee"],
  ["#4f7dfb", "#0a1120", "#22d3a8"],
  ["#f4614f", "#1a0f24", "#4f7dfb"],
  ["#9b6bff", "#0a1120", "#35e0ee"],
  ["#22d3a8", "#0a1120", "#e14bd6"],
];

function hashString(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function PlaceholderArt({
  title,
  genre,
  className,
}: {
  title: string;
  genre?: string[];
  className?: string;
}) {
  const idx = hashString(title) % PALETTES.length;
  const [a, b, c] = PALETTES[idx];
  const angle = 100 + (hashString(title + "a") % 60);
  const initials = title
    .split(/\s+/)
    .filter((w) => w.length > 0 && /[A-Za-z0-9]/.test(w[0]))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{
        background: `linear-gradient(${angle}deg, ${a}55 0%, ${b} 45%, ${c}55 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 26px)",
        }}
      />
      <div
        className="absolute -right-6 -top-6 h-32 w-32 rounded-full blur-2xl opacity-50"
        style={{ background: c }}
      />
      <div
        className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full blur-2xl opacity-40"
        style={{ background: a }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display font-bold text-white/20 select-none"
          style={{ fontSize: "clamp(2.5rem, 18%, 5rem)" }}
        >
          {initials || "GL"}
        </span>
      </div>
      {genre?.[0] && (
        <span className="absolute left-3 top-3 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm">
          {genre[0]}
        </span>
      )}
    </div>
  );
}

// Autoplaying video covers, hardened against a well-known browser gotcha:
// setting `muted` as a JSX/HTML attribute doesn't always reliably apply
// before the browser evaluates an autoplay request, so autoplay can get
// silently blocked (no error — the video just never starts, which looks
// exactly like "the video isn't showing"). Setting `.muted` on the actual
// DOM node imperatively, before calling `.play()`, is the robust fix.
function VideoCover({
  src,
  className,
  onFailed,
}: {
  src: string;
  className?: string;
  onFailed: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Some browsers/contexts (e.g. strict data-saver mode) block
        // autoplay regardless — that's a browser policy, not a bug here.
        // The video's first frame still renders as a static fallback.
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="auto"
      onError={onFailed}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

export function CoverArt({
  title,
  genre,
  className,
  imageUrl,
}: {
  title: string;
  genre?: string[];
  className?: string;
  imageUrl?: string | null;
}) {
  // If a real image/video URL is set but fails to actually load (broken
  // link, wrong format — e.g. a Google Drive "share" link instead of a
  // direct file URL, a 404, a CORS/hotlink block), fall back to the
  // generated placeholder instead of showing a broken image icon.
  const [failed, setFailed] = useState(false);

  if (imageUrl && !failed) {
    if (isVideoUrl(imageUrl)) {
      return <VideoCover src={imageUrl} className={className} onFailed={() => setFailed(true)} />;
    }
    return (
      // Intentionally not next/image: cover URLs are arbitrary external
      // links (including ones that may 404 or block hotlinking), and this
      // component already handles that via onError falling back to
      // generated placeholder art.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={title}
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return <PlaceholderArt title={title} genre={genre} className={className} />;
}
