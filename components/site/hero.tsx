"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, Tag, Users, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { StatCounter } from "@/components/ui/stat-counter";
import { HERO_STATS, SITE } from "@/lib/config";

const ICONS = {
  gamepad: Gamepad2,
  tag: Tag,
  users: Users,
  shield: ShieldCheck,
};

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
    <section className="relative overflow-hidden border-b border-border-glass">
      {/* Atmosphere layers */}
      <div className="absolute inset-0 grid-atmosphere" />
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[8%] top-1/4 h-72 w-72 rounded-full bg-accent-secondary/20 blur-[100px]" />
        <div className="absolute right-[10%] top-1/3 h-80 w-80 rounded-full bg-accent-violet/20 blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-accent-primary/10 blur-[120px]" />
      </motion.div>

      {/* Subtle "character" silhouette suggestion via layered shapes, no external art */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-void via-void/60 to-transparent" />
        <svg
          viewBox="0 0 400 600"
          className="absolute bottom-0 right-8 h-[110%] w-auto opacity-[0.14]"
          fill="none"
        >
          <path
            d="M200 40 L360 130 L360 420 L200 560 L40 420 L40 130 Z"
            stroke="url(#hero-grad)"
            strokeWidth="1.5"
          />
          <path
            d="M200 120 L300 175 L300 370 L200 470 L100 370 L100 175 Z"
            stroke="url(#hero-grad)"
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="hero-grad" x1="0" y1="0" x2="400" y2="600">
              <stop offset="0%" stopColor="#35e0ee" />
              <stop offset="100%" stopColor="#9b6bff" />
            </linearGradient>
          </defs>
        </svg>
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
            <span className="text-gradient">starts here.</span>
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-lg text-base text-text-secondary sm:text-lg">
            {SITE.description}
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <LinkButton href="/games" size="lg">
              Explore games
              <ArrowRight size={18} />
            </LinkButton>
            <LinkButton href="/deals" variant="secondary" size="lg">
              Today&apos;s deals
            </LinkButton>
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-20 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:mt-24"
        >
          {HERO_STATS.map((stat) => {
            const Icon = ICONS[stat.icon];
            return (
              <motion.div key={stat.label} variants={item} className="flex flex-col gap-2">
                <Icon size={20} className="text-accent-primary" />
                <StatCounter value={stat.value} />
                <span className="text-xs text-text-muted sm:text-sm">{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
