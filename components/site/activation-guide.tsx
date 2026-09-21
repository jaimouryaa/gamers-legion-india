"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { ACTIVATION_GUIDES } from "@/lib/config";
import { cn } from "@/lib/utils";

export function ActivationGuide({
  platforms,
  defaultOpen = false,
}: {
  /** If provided, only shows guides matching these platform tags (e.g. a
   * game's own `platforms` field). Omit to show every guide. */
  platforms?: string[];
  defaultOpen?: boolean;
}) {
  const guides = platforms
    ? ACTIVATION_GUIDES.filter((g) => g.matches.some((m) => platforms.includes(m)))
    : ACTIVATION_GUIDES;

  if (guides.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {guides.map((guide) => (
        <GuideItem key={guide.platform} guide={guide} defaultOpen={defaultOpen} />
      ))}
    </div>
  );
}

function GuideItem({
  guide,
  defaultOpen,
}: {
  guide: (typeof ACTIVATION_GUIDES)[number];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-border-glass bg-surface/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-sm font-semibold text-text-primary">
          {guide.title}
        </span>
        <ChevronDown
          size={16}
          className={cn("text-text-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="border-t border-border-glass px-4 py-3">
          <ol className="flex flex-col gap-2">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-accent-cyan" />
                {step}
              </li>
            ))}
          </ol>
          {"note" in guide && guide.note && (
            <p className="mt-3 text-xs text-text-muted">{guide.note}</p>
          )}
        </div>
      )}
    </div>
  );
}
