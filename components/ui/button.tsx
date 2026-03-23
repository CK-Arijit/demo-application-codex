import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type ButtonVariant = "primary" | "outline" | "surface";
type ButtonSize = "sm" | "md" | "compact";
type ButtonShape = "rounded" | "pill";

type ButtonStyleOptions = Readonly<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  className?: string;
}>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-(--color-primary) text-white hover:opacity-95 disabled:opacity-40",
  outline:
    "border border-(--color-border) text-(--color-text) hover:border-(--color-secondary) disabled:opacity-40",
  surface:
    "border border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-secondary) disabled:opacity-40",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2",
  md: "px-4 py-2.5",
  compact: "px-3 py-2",
};

const shapeClasses: Record<ButtonShape, string> = {
  rounded: "rounded-xl",
  pill: "rounded-full",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  shape = "rounded",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    shapeClasses[shape],
    fullWidth && "w-full",
    className
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleOptions;

export function Button({ variant, size, shape, fullWidth, className, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, shape, fullWidth, className })} {...props} />
  );
}
