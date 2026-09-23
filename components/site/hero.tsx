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

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.p
            variants={item}
            className="mb-5 text-xs font-semibold tracking-[0.25em] text-accent-primary"
          >
            {SITE.name.toUpperCase()}
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            Your next game<br />
            <span className="text-gradient arcade-title">starts here.</span>
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-lg text-base text-text-secondary sm:text-lg">
            {SITE.description}
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <LinkButton href="/games" size="lg" className="arcade-cta">
              Explore games
              <ArrowRight size={18} />
            </LinkButton>
            <LinkButton href="/deals" variant="secondary" size="lg">
              Today&apos;s deals
            </LinkButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
    </MotionConfig>
  );
}
