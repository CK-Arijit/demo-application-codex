import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "./cn";

type CardElement = "div" | "section" | "header" | "article";

type CardProps<T extends ElementType> = Readonly<{
  as?: T;
  className?: string;
}> &
  Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Card<T extends CardElement = "section">({ as, className, ...props }: CardProps<T>) {
  const Component = (as ?? "section") as ElementType;

  return (
    <Component
      className={cn(
        "rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-sm",
        className
      )}
      {...props}
    />
  );
}
