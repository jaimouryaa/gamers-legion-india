"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
const LEAVE_MS = 900;

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
  const dialogRef = useRef<HTMLDivElement>(null);

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

  // Slide the intro up and reveal the site underneath.
  const enter = useCallback(() => {
    if (phase !== "show") return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setPhase("leaving");
    setTimeout(() => setPhase("done"), reduce ? 0 : LEAVE_MS + 50);
  }, [phase, reduce]);

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

  // Put focus on the intro so keyboard users can dismiss it right away.
  useEffect(() => {
    if (phase === "show") dialogRef.current?.focus({ preventScroll: true });
  }, [phase]);

  // Scrolling down (wheel, swipe up, arrow/page/Enter/Space keys) lifts the intro away.
  useEffect(() => {
    if (phase !== "show") return;
    const armedAt = Date.now() + 600; // ignore leftover scroll momentum
    const armed = () => Date.now() > armedAt;
    let startY = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 8 && armed()) enter();
    };
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (startY - e.touches[0].clientY > 40 && armed()) enter();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End", "Enter", " "].includes(e.key) && armed()) enter();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, enter]);

  if (phase === "done") return null;

  const leaving = phase === "leaving";

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Gamers Legion India"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6 outline-none text-center transition-transform motion-reduce:transition-none ${
        leaving ? "pointer-events-none -translate-y-full" : "translate-y-0"
      }`}
      style={{
        transitionDuration: `${LEAVE_MS}ms`,
        transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
        touchAction: "none",
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

      <div className="relative flex flex-col items-center">
        <h1 className="m-0">
          <span className="sr-only">Gamers Legion India</span>
          <motion.div
            aria-hidden
            initial={reduce ? false : { opacity: 0, scale: 0.96, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1, delay: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <Image
              src="/gl-wordmark.webp"
              alt=""
              width={1094}
              height={192}
              priority
              sizes="(max-width: 900px) 88vw, 820px"
              className="h-auto w-[min(88vw,820px)]"
            />
          </motion.div>
        </h1>
        <motion.div
          className="mt-4"
          initial={reduce ? false : { opacity: 0, y: 12, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 0.7, y: 0, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.9, delay: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <Image
            src="/gl-tagline.webp"
            alt="Join the Legion"
            width={1146}
            height={198}
            sizes="(max-width: 900px) 27vw, 246px"
            className="h-auto w-[calc(min(88vw,820px)*0.3)]"
          />
        </motion.div>
        <p className="sr-only">Scroll down or press Enter to continue.</p>
      </div>

      {/* Quiet cue that the screen scrolls away (not a button) */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-1/2 h-9 w-px -translate-x-1/2 origin-top bg-[#f5ebdd]/60"
        initial={reduce ? false : { opacity: 0, scaleY: 0 }}
        animate={reduce ? { opacity: 0.6 } : { opacity: [0, 0.7, 0.7, 0], scaleY: [0, 1, 1, 1] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.2, delay: 1.8, repeat: Infinity, repeatDelay: 0.4, ease: "easeInOut" }
        }
      />
    </div>
  );
}
