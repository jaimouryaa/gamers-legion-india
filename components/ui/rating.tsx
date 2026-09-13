import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
}: {
  value: number | null;
  count?: number | null;
  size?: "sm" | "md";
}) {
  if (value == null) return null;
  const iconSize = size === "sm" ? 13 : 16;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={iconSize}
            className={cn(
              i < Math.round(value)
                ? "fill-warning text-warning"
                : "fill-transparent text-text-muted"
            )}
          />
        ))}
      </div>
      <span className={cn("font-medium text-text-secondary", size === "sm" ? "text-xs" : "text-sm")}>
        {value.toFixed(1)}
      </span>
      {count != null && (
        <span className={cn("text-text-muted", size === "sm" ? "text-xs" : "text-sm")}>
          ({count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count})
        </span>
      )}
    </div>
  );
}
