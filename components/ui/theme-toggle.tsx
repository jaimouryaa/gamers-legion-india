"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type ThemePreference } from "@/lib/theme-store";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ThemePreference; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { preference, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-border-glass bg-surface/60 p-0.5",
        className
      )}
      role="radiogroup"
      aria-label="Theme"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = preference === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              active
                ? "bg-accent-cyan/15 text-accent-cyan"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
}
