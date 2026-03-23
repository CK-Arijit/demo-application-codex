import type { ComponentPropsWithoutRef } from "react";
import { cn } from "./cn";

type LabelTextProps = ComponentPropsWithoutRef<"span">;

export function LabelText({ className, ...props }: LabelTextProps) {
  return <span className={cn("text-sm font-medium text-(--color-text)", className)} {...props} />;
}

type MutedTextProps = ComponentPropsWithoutRef<"p">;

export function MutedText({ className, ...props }: MutedTextProps) {
  return <p className={cn("text-sm text-(--color-muted)", className)} {...props} />;
}

type EyebrowTextProps = ComponentPropsWithoutRef<"p">;

export function EyebrowText({ className, ...props }: EyebrowTextProps) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-wide text-(--color-secondary)",
        className
      )}
      {...props}
    />
  );
}

type PrimaryTitleProps = ComponentPropsWithoutRef<"h1">;

export function PrimaryTitle({ className, ...props }: PrimaryTitleProps) {
  return (
    <h1 className={cn("text-2xl font-semibold text-(--color-primary)", className)} {...props} />
  );
}
