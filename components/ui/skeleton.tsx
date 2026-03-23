import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./cn";

type SkeletonBlockProps = ComponentPropsWithoutRef<"div">;

export function SkeletonBlock({ className, ...props }: SkeletonBlockProps) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-(--color-surface-soft)", className)}
      {...props}
    />
  );
}
