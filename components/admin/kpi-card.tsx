"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { StatCounter } from "@/components/ui/stat-counter";

export function KpiCard({
  icon: Icon,
  value,
  label,
  change,
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  change?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-panel rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-accent-primary">
          <Icon size={17} />
        </div>
        {change && <span className="text-xs font-medium text-success">{change}</span>}
      </div>
      <div className="mt-3">
        <StatCounter value={value.toLocaleString("en-IN")} duration={0.9} />
      </div>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </motion.div>
  );
}
