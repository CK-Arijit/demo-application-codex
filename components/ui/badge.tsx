import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./cn";

type BadgeTone = "muted" | "secondary";

const toneClasses: Record<BadgeTone, string> = {
  muted: "bg-(--color-surface-soft) text-(--color-muted)",
  secondary: "bg-(--color-surface-soft) text-(--color-secondary)",
};

type BadgeProps = ComponentPropsWithoutRef<"span"> &
  Readonly<{
    tone?: BadgeTone;
  }>;

export function Badge({ tone = "muted", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
