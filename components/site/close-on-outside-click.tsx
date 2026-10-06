"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Click on the empty area around a card to dismiss it (go back, or to a fallback page).
 * Anything inside an element marked `data-keep-open`, and any link/button/input, is ignored.
 */
export function CloseOnOutsideClick({
  children,
  className,
  fallbackHref = "/games",
}: {
  children: ReactNode;
  className?: string;
  fallbackHref?: string;
}) {
  const router = useRouter();

  return (
    <div
      className={className}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-keep-open], a, button, input, select, textarea, label, [role='dialog']")) return;
        if (window.history.length > 1) router.back();
        else router.push(fallbackHref);
      }}
    >
      {children}
    </div>
  );
}

export default CloseOnOutsideClick;
