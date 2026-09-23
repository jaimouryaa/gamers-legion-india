"use client";

import { MotionConfig, motion } from "framer-motion";
import { Gamepad2, Tag, Users, ShieldCheck } from "lucide-react";
import { StatCounter } from "@/components/ui/stat-counter";
import { HERO_STATS } from "@/lib/config";

const ICONS = {
  gamepad: Gamepad2,
  tag: Tag,
  users: Users,
  shield: ShieldCheck,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export function StatsStrip() {
  return (
    <MotionConfig reducedMotion="user">
    <section className="border-t border-border-glass bg-surface/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {HERO_STATS.map((stat) => {
            const Icon = ICONS[stat.icon];
            return (
              <motion.div key={stat.label} variants={item} className="group flex flex-col gap-2">
                <Icon size={20} className="text-accent-primary" />
                <StatCounter value={stat.value} />
                <span className="text-xs text-text-muted sm:text-sm">{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
    </MotionConfig>
  );
}
