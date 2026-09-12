import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Price({
  original,
  sale,
  size = "sm",
  className,
}: {
  original: number;
  sale: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hasDiscount = original > sale;
  const saleClass = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-base";
  const origClass = size === "lg" ? "text-base" : "text-sm";
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-display font-semibold text-text-primary", saleClass)}>
        {formatINR(sale)}
      </span>
      {hasDiscount && (
        <span className={cn("text-text-muted line-through", origClass)}>
          {formatINR(original)}
        </span>
      )}
    </div>
  );
}
