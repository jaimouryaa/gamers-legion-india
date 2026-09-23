"use client";

import { MotionConfig, motion } from "framer-motion";
import { Zap, Lock, BadgeCheck, TrendingDown } from "lucide-react";
import { FEATURE_STRIP } from "@/lib/config";

const ICONS = {
  zap: Zap,
  lock: Lock,
  "badge-check": BadgeCheck,
  "trending-down": TrendingDown,
};

export function FeatureStrip() {
  return (
    <MotionConfig reducedMotion="user">
    <section className="border-b border-border-glass bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_STRIP.map((f, i) => {
            const Icon = ICONS[f.icon];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="arcade-card group glass-panel relative overflow-hidden rounded-2xl p-5 transition-colors hover:border-accent-primary/40"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent-primary/0 blur-2xl transition-all duration-300 group-hover:bg-accent-primary/15" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-accent-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon size={19} />
                </div>
                <h3 className="relative mt-4 font-display text-sm font-semibold text-text-primary">
                  {f.title}
                </h3>
                <p className="relative mt-1.5 text-sm text-text-muted">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
    </MotionConfig>
  );
}
