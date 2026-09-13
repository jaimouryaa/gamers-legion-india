import { cn } from "@/lib/utils";

export function DiscountBadge({ percentage, className }: { percentage: number; className?: string }) {
  if (percentage <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gradient-to-r from-accent-magenta to-accent-violet px-2.5 py-1 text-xs font-bold text-white shadow-[0_0_16px_-4px_rgba(225,75,214,0.7)]",
        className
      )}
    >
      {percentage}% OFF
    </span>
  );
}

export function StatusPill({ status }: { status: "active" | "draft" | "archived" | "expired" }) {
  const map = {
    active: { dot: "bg-success", text: "text-success", label: "Active" },
    draft: { dot: "bg-text-muted", text: "text-text-muted", label: "Draft" },
    archived: { dot: "bg-warning", text: "text-warning", label: "Archived" },
    expired: { dot: "bg-danger", text: "text-danger", label: "Expired" },
  } as const;
  const s = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", s.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
