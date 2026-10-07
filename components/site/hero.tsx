"use client";

import Image from "next/image";
import { MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { SITE } from "@/lib/config";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
    <section className="relative overflow-hidden border-b border-border-glass">
      {/* Atmosphere layers */}
      <div className="absolute inset-0 grid-atmosphere" />
      <div aria-hidden="true" className="arcade-hero-grid pointer-events-none absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[8%] top-1/4 h-72 w-72 rounded-full bg-accent-secondary/20 blur-[100px]" />
        <div className="absolute right-[10%] top-1/3 h-80 w-80 rounded-full bg-accent-violet/20 blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-accent-primary/10 blur-[120px]" />
        <div className="arcade-hero-glow absolute left-[45%] top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/15 blur-[90px]" />
      </motion.div>

      {/* A soft brand watermark sits behind the copy without competing with it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[min(115vw,52rem)] -translate-x-1/2 -translate-y-1/2 opacity-[0.10] mix-blend-multiply dark:opacity-[0.20] dark:mix-blend-screen lg:left-[45%]"
          style={{ maskImage: "radial-gradient(ellipse, black 28%, transparent 72%)" }}
        >
          <Image src="/hero-brand.png" alt="" fill sizes="(max-width: 768px) 100vw, 832px" className="arcade-hero-logo object-contain" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.p
            variants={item}
            className="mb-4 text-sm font-semibold tracking-[0.2em] text-accent-primary sm:mb-5 sm:text-base sm:tracking-[0.25em] lg:text-lg"
          >
            {SITE.name.toUpperCase()}
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl"
          >
            Join The<br />
            <span className="text-gradient arcade-title">Legion.</span>
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary sm:mt-6 sm:text-xl lg:text-2xl">
            {SITE.description}
          </motion.p>
          <motion.div
            variants={item}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 28px -4px rgba(155,27,48,0.45)",
              borderColor: "rgba(155,27,48,0.65)",
              backgroundColor: "rgba(155,27,48,0.10)",
            }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="mt-5 flex w-full max-w-lg cursor-default sm:inline-flex sm:w-auto items-start gap-3 rounded-xl border border-[#9B1B30]/30 bg-[#9B1B30]/8 px-4 py-3"
          >
            <motion.span
              className="mt-0.5 shrink-0 text-[#C4354F]"
              whileHover={{ rotate: 180, scale: 1.3 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >✦</motion.span>
            <p className="text-sm leading-relaxed text-text-secondary">
              <span className="font-semibold text-[#C4354F]">Game Not Listed? We&apos;ve Got You.</span>{" "}
              Just drop us a message with the game you want. If it&apos;s playable on PC, we&apos;ll source it and set it up for you on demand.
            </p>
          </motion.div>
          <motion.div variants={item} className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center">
            <LinkButton href="/games" size="lg" className="arcade-cta w-full sm:w-auto">
              Explore games
              <ArrowRight size={18} />
            </LinkButton>
            <LinkButton href="/deals" variant="secondary" size="lg" className="w-full sm:w-auto">
              Today&apos;s deals
            </LinkButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
    </MotionConfig>
  );
}
