"use client";

import { MotionConfig, motion } from "framer-motion";
import {
  BadgeCheck,
  Gamepad2,
  Headset,
  LockKeyhole,
  MonitorCheck,
  Zap,
} from "lucide-react";

const stages = [
  {
    title: "Total Stealth & Security",
    icon: LockKeyhole,
    description:
      "No logins, no passwords, no OTPs ever. Everything goes down live on your monitor within 3–5 minutes while you hold full control of the wheel.",
    signoff: '"Stay frosty, your credentials stay yours Sergeant!',
  },
  {
    title: "Assisted game activation",
    icon: Headset,
    description:
      "The second your order clears and your ticket goes live, the loot (game activation code/bundle package) drops instantly. A dedicated squad member jumps into the lobby to connect with you to guide the activation setup from start to finish.",
    signoff: '"Tactical support inbound."',
  },
  {
    title: "AFK Setup (Zero Hassle)",
    icon: MonitorCheck,
    description:
      "Sit back and let us do the heavy lifting. Our crew handles the Code setup directly on your rig so you don’t have to grind through complicated folders or tech errors.",
    signoff: '"Mission passed, respect +."',
  },
  {
    title: "Launch & Dominate",
    icon: Gamepad2,
    description:
      "Once the code files sync with your steam,  and game is downloaded your game starts straight into full action. No waiting, just pure gameplay.",
  },
  {
    title: "24/7 Co-Op & Rig Check",
    icon: Zap,
    description:
      "Our comms are wide open round the clock. Wondering if your rig can handle Cyberpunk 2077 on Path Tracing or Black Myth: Wukong without turning into a jet engine? drop your PC specs anytime and our squad will verify if your battle station can run the game smoothly before or after you buy.",
    signoff: '"We’ve got your back, 24/7."',
  },
] as const;

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 230, damping: 25 },
  },
};

export function LevelUpActivation() {
  return (
    <MotionConfig reducedMotion="user">
    <section aria-labelledby="activation-title" className="mt-16">
      <div className="relative overflow-hidden rounded-3xl border border-border-glass-strong bg-surface-elevated px-5 py-8 sm:px-8 sm:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,color-mix(in_srgb,var(--accent-cyan)_18%,transparent),transparent_42%),linear-gradient(145deg,color-mix(in_srgb,var(--accent-blue)_10%,transparent),transparent_60%)]"
        />
        <div className="relative">
          <p className="mb-3 flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent-magenta">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-magenta shadow-[0_0_12px_var(--accent-magenta)]" />
            Activation briefing
          </p>
          <h2 id="activation-title" className="max-w-2xl font-display text-2xl font-bold leading-tight text-text-primary sm:text-4xl">
            Level Up: How Your Game Gets Activated
          </h2>

          <motion.ol
            className="mt-8 grid gap-4 md:grid-cols-2"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
          >
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.li
                  key={stage.title}
                  variants={cardVariants}
                  className="arcade-stage group relative overflow-hidden rounded-2xl border border-border-glass-strong bg-surface/85 p-5 transition-[border-color,box-shadow] hover:border-accent-cyan/60 sm:p-6"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-cyan/25 bg-accent-cyan/10 text-accent-magenta">
                      <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="font-display text-xs font-bold tracking-[0.2em] text-text-muted">
                      {String(index + 1).padStart(2, "0")} / 05
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-text-primary">
                    {stage.title}:
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text-secondary">
                    {stage.description}
                  </p>
                  {"signoff" in stage && stage.signoff && (
                    <p className="mt-4 border-l-2 border-accent-cyan pl-3 font-display text-sm font-semibold leading-6 text-accent-magenta">
                      {stage.signoff}
                    </p>
                  )}
                </motion.li>
              );
            })}
          </motion.ol>

          <motion.div
            className="arcade-finisher mt-4 flex flex-col gap-4 rounded-2xl border border-accent-cyan/40 bg-accent-cyan/10 p-5 sm:flex-row sm:items-center sm:p-6"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.65 }}
            transition={{ type: "spring", stiffness: 230, damping: 25 }}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-cyan text-white">
              <BadgeCheck size={23} aria-hidden="true" />
            </span>
            <p className="text-sm leading-7 text-text-primary">
              <strong className="font-display text-base text-accent-magenta">Zero Friendly Fire:</strong>{" "}
              100% visible on your screen, lightning-fast 3-5 minute setup, while you hold the controller the entire time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
