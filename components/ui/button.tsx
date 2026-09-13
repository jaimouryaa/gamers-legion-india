import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

// Only transform/colors animate on hover (cheap, GPU-composited). box-shadow
// and filter are applied as static hover states instead of being part of
// the transition — animating blur radius or `filter` every frame forces a
// full repaint and is what made buttons feel laggy on hover/click.
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide will-change-transform transition-[transform,background-color,border-color,color] duration-150 ease-out hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-accent-cyan to-accent-blue text-[#fdf1f3] shadow-[0_0_22px_-8px_rgba(212,51,95,0.6)] hover:brightness-110",
  secondary:
    "bg-white/5 text-text-primary border border-border-glass-strong hover:bg-white/10 hover:border-accent-cyan/50",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-white/5",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(BASE, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link
      href={href}
      className={cn(BASE, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
