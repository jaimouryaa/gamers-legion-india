"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CoverArt } from "@/components/ui/cover-art";

export interface GameWheelItem {
  id: string;
  title: string;
  image: string | null;
  href: string;
  genre?: string[];
}

export interface GameWheelHandle {
  goTo: (index: number) => void;
}

interface GameWheelProps {
  items: GameWheelItem[];
  onActiveChange?: (index: number) => void;
  /** Let the mouse wheel rotate the covers while the pointer is over the wheel. */
  captureWheel?: boolean;
  className?: string;
}

// Geometry (tuned for portrait covers)
const STEP = 24; // degrees between neighbouring covers
const MAX_ANGLE = 72; // covers beyond this are hidden
const CARD_RATIO = 0.67; // width / height
const PERSPECTIVE = 1800;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const wrap = (d: number, n: number) => ((((d + n / 2) % n) + n) % n) - n / 2;

export const GameWheel = forwardRef<GameWheelHandle, GameWheelProps>(function GameWheel(
  { items, onActiveChange, captureWheel = true, className = "" },
  ref,
) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const glowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const suppressClick = useRef(false);
  const activeCb = useRef(onActiveChange);
  const api = useRef<{ goTo: (i: number) => void; step: (d: number) => void; active: () => number }>({ goTo: (_i) => {}, step: (_d) => {}, active: () => 0 });
  const n = items.length;

  useEffect(() => {
    activeCb.current = onActiveChange;
  }, [onActiveChange]);

  useImperativeHandle(ref, () => ({ goTo: (i: number) => api.current.goTo(i) }), []);

  useEffect(() => {
    const stage = stageRef.current;
    const drum = drumRef.current;
    if (!stage || !drum || n === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = { turn: 0, target: 0, raf: 0, last: 0, W: 270, H: 400, R: 1200, active: -1 };
    let wheelTimer = 0;
    let suppressTimer = 0;

    // Direct DOM writes (no React renders per frame).
    const render = () => {
      const act = ((Math.round(st.turn) % n) + n) % n;
      for (let i = 0; i < n; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const a = (n > 1 ? wrap(i - st.turn, n) : 0) * STEP;
        const abs = Math.abs(a);
        if (abs > MAX_ANGLE) {
          card.style.visibility = "hidden";
          continue;
        }
        const strength = clamp(1 - abs / (STEP * 1.1));
        card.style.visibility = "visible";
        card.style.opacity = String(1 - Math.pow(abs / MAX_ANGLE, 1.4) * 0.95);
        card.style.transform = `translate(-50%,-50%) rotateX(${-a}deg) translateZ(${st.R}px) scale(${1 + 0.04 * strength})`;
        const glow = glowRefs.current[i];
        if (glow) glow.style.opacity = String(strength);
      }
      if (act !== st.active) {
        st.active = act;
        cardRefs.current.forEach((c, i) => c?.setAttribute("aria-selected", String(i === act)));
        stage.setAttribute("aria-activedescendant", `gw-opt-${items[act].id}`);
        activeCb.current?.(act);
      }
    };

    const layout = () => {
      const r = stage.getBoundingClientRect();
      let H = Math.min(r.height * 0.6, 580);
      let W = H * CARD_RATIO;
      if (W > r.width * 0.68) {
        W = r.width * 0.68;
        H = W / CARD_RATIO;
      }
      st.W = W;
      st.H = H;
      st.R = (H * 1.12) / ((STEP * Math.PI) / 180);
      drum.style.transform = `translateZ(${-st.R}px)`;
      for (const c of cardRefs.current) {
        if (c) {
          c.style.width = `${W}px`;
          c.style.height = `${H}px`;
        }
      }
      render();
      stage.style.opacity = "1";
    };

    const tick = (now: number) => {
      const dt = Math.min((now - st.last) / 1000, 0.05) || 0.016;
      st.last = now;
      const diff = st.target - st.turn;
      if (reduce || Math.abs(diff) < 0.001) {
        st.turn = st.target;
        st.raf = 0;
        render();
        return;
      }
      st.turn += diff * (1 - Math.exp(-dt * 9));
      render();
      st.raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!st.raf) {
        st.last = performance.now();
        st.raf = requestAnimationFrame(tick);
      }
    };

    api.current = {
      goTo: (index) => {
        const base = Math.round(st.target);
        const cur = ((base % n) + n) % n;
        st.target = base + (n > 1 ? wrap(index - cur, n) : 0);
        kick();
      },
      step: (d) => {
        st.target = Math.round(st.target) + d;
        kick();
      },
      active: () => (st.active < 0 ? 0 : st.active) as number,
    };

    // Mouse wheel (only while the pointer is over the wheel).
    const onWheel = (e: WheelEvent) => {
      if (!captureWheel || e.ctrlKey || n < 2) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      const dy = clamp(e.deltaY * (e.deltaMode === 1 ? 16 : 1), -120, 120);
      st.target = clamp(st.target + dy * 0.006, st.turn - 3, st.turn + 3);
      kick();
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        st.target = Math.round(st.target);
        kick();
      }, 140);
    };

    // Drag: vertical with a mouse; horizontal swipe on touch (keeps page scrolling free).
    let drag: { id: number; x: number; y: number; t0: number; touch: boolean; moved: boolean } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t0: st.target, touch: e.pointerType === "touch", moved: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag.touch ? drag.x - e.clientX : drag.y - e.clientY;
      if (!drag.moved) {
        if (Math.abs(d) < 6) return;
        drag.moved = true;
        try {
          stage.setPointerCapture(e.pointerId);
        } catch {}
      }
      st.target = drag.t0 + d / (drag.touch ? st.W * 0.75 : st.H * 0.55);
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) {
        suppressClick.current = true;
        window.clearTimeout(suppressTimer);
        suppressTimer = window.setTimeout(() => (suppressClick.current = false), 80);
      }
      drag = null;
      st.target = Math.round(st.target);
      kick();
    };

    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    layout();

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(st.raf);
      window.clearTimeout(wheelTimer);
      window.clearTimeout(suppressTimer);
      ro.disconnect();
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
    };
  }, [items, n, captureWheel]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        api.current.step(1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        api.current.step(-1);
        break;
      case "Home":
        e.preventDefault();
        api.current.goTo(0);
        break;
      case "End":
        e.preventDefault();
        api.current.goTo(n - 1);
        break;
      case "Enter":
        if (e.target === e.currentTarget && items[api.current.active()]) {
          e.preventDefault();
          router.push(items[api.current.active()].href);
        }
        break;
    }
  };

  return (
    <div
      ref={stageRef}
      role="listbox"
      aria-label="Featured games"
      aria-orientation="vertical"
      aria-activedescendant={items[0] ? `gw-opt-${items[0].id}` : undefined}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`relative cursor-grab select-none overflow-hidden rounded-2xl opacity-0 outline-none transition-opacity duration-500 focus-visible:ring-2 focus-visible:ring-accent-primary/60 active:cursor-grabbing ${className}`}
      style={{ perspective: PERSPECTIVE, touchAction: "pan-y" }}
    >
      <div ref={drumRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {items.map((it, i) => (
          <Link
            key={it.id}
            id={`gw-opt-${it.id}`}
            href={it.href}
            role="option"
            aria-selected={i === 0}
            aria-label={it.title}
            tabIndex={-1}
            draggable={false}
            prefetch={false}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            onClick={(e) => {
              if (suppressClick.current) e.preventDefault();
            }}
            className="absolute left-1/2 top-1/2 block cursor-pointer will-change-transform [backface-visibility:hidden] [&_img]:pointer-events-none [&_video]:pointer-events-none"
            style={{ visibility: i === 0 ? "visible" : "hidden" }}
          >
            {/* Stronger shadow that fades in on the active cover (opacity only, cheap to animate) */}
            <span
              ref={(el) => {
                glowRefs.current[i] = el;
              }}
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 shadow-[0_34px_70px_-18px_rgba(0,0,0,0.6)]"
            />
            {/* The cover is the card: artwork only, subtle border and shadow */}
            <span className="relative block h-full w-full overflow-hidden rounded-[10px] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-transform duration-200 hover:-translate-y-0.5 dark:ring-white/10">
              <CoverArt title={it.title} genre={it.genre} imageUrl={it.image} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default GameWheel;
