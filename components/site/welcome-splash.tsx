"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
import { Big_Shoulders, Rajdhani } from "next/font/google";

const display = Big_Shoulders({subsets: ["latin"],weight: ["800", "900"],adjustFontFallback: false});
const body = Rajdhani({ subsets: ["latin", "devanagari"], weight: ["500", "600"] });

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const COLS = 13;
const ROWS = 6;

/* Palette: night #100D1F, plum #2A1B5C, violet #6C4BFF, saffron #FFB21E, bone #F3EFFF */

const overlay = {
  exit: (instant: boolean) => ({
    y: "-100%",
    transition: { duration: instant ? 0 : 0.9, ease: EASE },
  }),
};

const chevron = {
  hidden: { opacity: 0, y: 28 },
  intro: (d: number) => ({
    opacity: 0.3,
    y: 0,
    transition: { delay: 0.2 + d * 0.07, duration: 0.6, ease: EASE },
  }),
  ready: (d: number) => ({
    opacity: [0.3, 1, 0.3],
    color: ["#6C4BFF", "#FFB21E", "#6C4BFF"],
    transition: { delay: d * 0.06, duration: 1.1, ease: "easeInOut" as const },
  }),
};

function Chevron({ d, reduce }: { d: number; reduce: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 28 16"
      className="h-4 w-7 text-[#6C4BFF]"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="square"
      strokeLinejoin="miter"
      variants={chevron}
      custom={d}
      initial={reduce ? false : "hidden"}
      aria-hidden
    >
      <path d="M2 14 L14 3 L26 14" />
    </motion.svg>
  );
}

function Line({ text, delay, reduce }: { text: string; delay: number; reduce: boolean }) {
  return (
    <span className="flex justify-center overflow-hidden py-[0.02em]" aria-hidden>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { y: "105%" }}
          animate={{ y: 0 }}
          transition={{ delay: delay + i * 0.045, duration: 0.7, ease: EASE }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

type Props = {
  /** Show only once per browser session (default true). */
  once?: boolean;
  /** Enter the store automatically this many ms after loading finishes. */
  autoEnterMs?: number;
  storageKey?: string;
};

export default function WelcomeSplash({
  once = true,
  autoEnterMs,
  storageKey = "gli-welcome-seen",
}: Props) {
  const reduce = !!useReducedMotion();
  const [phase, setPhase] = useState<"show" | "done">("show");
  const [stage, setStage] = useState<"intro" | "ready">("intro");
  const [progress, setProgress] = useState(0);
  const [instant, setInstant] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {}
    setPhase("done");
  }, [storageKey]);

  // Returning visitors in the same session skip straight to the store.
  useEffect(() => {
    try {
      if (once && sessionStorage.getItem(storageKey)) {
        setInstant(true);
        setPhase("done");
      }
    } catch {}
  }, [once, storageKey]);

  // Lock page scroll while the splash is up.
  useEffect(() => {
    if (phase !== "show") return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [phase]);

  // Loading counter.
  useEffect(() => {
    if (phase !== "show") return;
    if (reduce) {
      setProgress(100);
      setStage("ready");
      return;
    }
    const controls = animate(0, 100, {
      duration: 2.6,
      delay: 0.5,
      ease: "easeInOut",
      onUpdate: (v) => setProgress(Math.round(v)),
      onComplete: () => setStage("ready"),
    });
    return () => controls.stop();
  }, [phase, reduce]);

  useEffect(() => {
    if (stage !== "ready" || phase !== "show") return;
    enterRef.current?.focus();
    if (!autoEnterMs) return;
    const t = setTimeout(dismiss, autoEnterMs);
    return () => clearTimeout(t);
  }, [stage, phase, autoEnterMs, dismiss]);

  useEffect(() => {
    if (phase !== "show") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.key === "Enter" && stage === "ready")) dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, stage, dismiss]);

  const ready = stage === "ready";

  return (
    <AnimatePresence custom={instant}>
      {phase === "show" && (
        <motion.div
          key="welcome"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to Gamers Legion India"
          variants={overlay}
          initial={false}
          exit="exit"
          className={`${body.className} fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6 text-center text-[#F3EFFF]`}
          style={{
            background:
              "radial-gradient(60% 50% at 50% 55%, #2A1B5C 0%, #100D1F 72%)",
          }}
        >
          {/* The legion: ranks of chevrons rising into formation */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{
              maskImage:
                "radial-gradient(ellipse at center, transparent 16%, #000 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, transparent 16%, #000 78%)",
            }}
            aria-hidden
          >
            <motion.div
              className="grid gap-x-5 gap-y-7"
              style={{ gridTemplateColumns: `repeat(${COLS}, auto)` }}
              animate={stage}
            >
              {Array.from({ length: ROWS * COLS }).map((_, i) => {
                const r = Math.floor(i / COLS);
                const c = i % COLS;
                const dx = c - (COLS - 1) / 2;
                const dy = (r - (ROWS - 1) / 2) * 1.6;
                const d = Math.hypot(dx, dy);
                return <Chevron key={i} d={d} reduce={reduce} />;
              })}
            </motion.div>
          </div>

          <h1 className="sr-only">Welcome to Gamers Legion India</h1>

          <motion.p
            className="relative text-[clamp(1.5rem,3vw,2rem)] font-semibold text-[#FFB21E]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            स्वागत है
          </motion.p>

          <div
            className={`${display.className} relative mt-2 text-[clamp(4.25rem,17vw,12rem)] font-black leading-[0.9] tracking-[0.02em]`}
          >
            <Line text="GAMERS" delay={0.5} reduce={reduce} />
            <Line text="LEGION" delay={0.75} reduce={reduce} />
          </div>

          <motion.div
            className="relative mt-4 flex w-full max-w-md items-center gap-4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <motion.span
              className="h-px flex-1 origin-right bg-[#FFB21E]"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.7, ease: EASE }}
            />
            <span
              className={`${display.className} text-2xl font-extrabold uppercase tracking-[0.5em] text-[#FFB21E]`}
            >
              India
            </span>
            <motion.span
              className="h-px flex-1 origin-left bg-[#FFB21E]"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.7, ease: EASE }}
            />
          </motion.div>

          <motion.p
            className="relative mt-5 text-lg font-medium text-[#F3EFFF]/80"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            India&apos;s gaming marketplace. Order on WhatsApp.
          </motion.p>

          {/* Loader becomes the Enter button */}
          <div className="relative mt-10 flex h-16 items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {!ready ? (
                <motion.div
                  key="loader"
                  className="flex w-64 items-center gap-3 text-sm font-medium text-[#F3EFFF]/70"
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Loading store</span>
                  <span className="h-px flex-1 bg-[#F3EFFF]/20">
                    <span
                      className="block h-px bg-[#FFB21E]"
                      style={{ width: `${progress}%` }}
                    />
                  </span>
                  <span className="w-9 text-right tabular-nums">{progress}%</span>
                </motion.div>
              ) : (
                <motion.span
                  key="enter"
                  className="p-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#F3EFFF]"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <button
                    ref={enterRef}
                    onClick={dismiss}
                    className="bg-[#FFB21E] px-10 py-3 text-xl font-semibold text-[#100D1F] outline-none transition-colors hover:bg-[#F3EFFF] focus-visible:bg-[#F3EFFF]"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                    }}
                  >
                    Enter store
                  </button>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={dismiss}
            className="absolute bottom-6 right-6 px-2 py-1 text-sm font-medium text-[#F3EFFF]/60 underline-offset-4 hover:text-[#F3EFFF] hover:underline focus-visible:text-[#F3EFFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F3EFFF]"
          >
            Skip intro
          </button>

          {/* Trailing edge that leads the wipe when the splash lifts away */}
          <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[#FFB21E]" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
