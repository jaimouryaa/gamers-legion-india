"use client";

import { MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";

export function ArcadeReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-35px" }}
        transition={{ type: "spring", stiffness: 220, damping: 25, delay }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
