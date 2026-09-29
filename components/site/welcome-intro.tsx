"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";

// WebGL is browser-only, so the glitter is never rendered on the server.
const Glitter = dynamic(
  () =>
    import("@/components/ui/animated-hero-with-web-gl-glitter").then(
      (m) => m.GlitterFinal,
    ),
  { ssr: false },
);

const SEEN_KEY = "gamers-legion-welcome-seen";
const FADE_MS = 1000;

const logoMask =
  "linear-gradient(to bottom, #000 0, #000 33%, transparent 41%, transparent 63%, #000 71%, #000 100%)";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function WelcomeIntro() {
  const [phase, setPhase] = useState<"show" | "leaving" | "done">("show");
  const [webgl, setWebgl] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reduce, setReduce] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) {
        setPhase("done");
        return;
      }
    } catch {}
    setWebgl(hasWebGL());
    setMobile(window.matchMedia("(max-width: 700px)").matches);
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Lock page scroll while the intro is on screen.
  useEffect(() => {
    if (phase === "done") return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [phase]);

  // Focus the button once it has appeared.
  useEffect(() => {
    if (phase !== "show") return;
    const t = setTimeout(() => enterRef.current?.focus({ preventScroll: true }), reduce ? 100 : 1700);
    return () => clearTimeout(t);
  }, [phase, reduce]);

  const enter = () => {
    if (phase !== "show") return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setPhase("leaving");
    setTimeout(() => setPhase("done"), reduce ? 0 : FADE_MS + 50);
  };

  if (phase === "done") return null;

  const leaving = phase === "leaving";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Gamers Legion India"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6 text-center transition-opacity motion-reduce:transition-none ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        transitionDuration: `${FADE_MS}ms`,
        background: webgl
          ? "radial-gradient(70% 55% at 50% 50%, #1c0810 0%, #0b0507 75%)"
          : "radial-gradient(60% 50% at 50% 50%, #3a0b17 0%, #0b0507 75%)",
      }}
    >
      {/* Faded logo: the middle band is masked so it never collides with the title */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(100vmin,1000px)] -translate-x-1/2 -translate-y-1/2"
        style={{ maskImage: logoMask, WebkitMaskImage: logoMask }}
        initial={reduce ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 0.32, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
      >
        <Image src="/gl-logo.webp" alt="" fill priority sizes="100vmin" className="object-contain" />
      </motion.div>

      {webgl && <Glitter boost={leaving} still={reduce} mobile={mobile} />}

      {/* Slow burgundy glow */}
      <motion.div
        aria-hidden
        className="absolute aspect-square w-[min(90vw,900px)] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(140,20,40,.42), transparent)" }}
        animate={reduce ? undefined : { opacity: [1, 0.6, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex max-w-[1100px] flex-col items-center gap-8 font-[family-name:var(--font-chakra)]">
        <motion.h1
          className="text-balance text-4xl font-bold leading-none tracking-[0.04em] text-[#dc3348] sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ textShadow: "0 0 40px rgba(140,20,40,.55)" }}
          initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
        >
          GAMERS LEGION INDIA
        </motion.h1>

        <motion.button
          ref={enterRef}
          type="button"
          onClick={enter}
          aria-label="Enter Gamers Legion India"
          className="border border-[#f5ebdd] px-11 py-3.5 text-base font-bold tracking-[0.3em] text-[#f5ebdd] transition-colors hover:border-[#dc3348] hover:bg-[#dc3348] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#f5ebdd]"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          ENTER
        </motion.button>
      </div>
    </div>
  );
}
