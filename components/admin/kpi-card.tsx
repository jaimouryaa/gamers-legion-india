"use client";

import { motion } from "framer-motion";
import { StatCounter } from "@/components/ui/stat-counter";

// `icon` is a pre-rendered element (e.g. `<Gamepad2 size={17} />`), not a
// component reference — Server Components can only pass plain data or
// already-rendered elements to Client Components, never a raw function/class
// reference like a lucide icon component itself.
export function KpiCard({
  icon,
  value,
  label,
  change,
}: {
  icon: React.ReactNode;
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
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-accent-cyan">
          {icon}
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
