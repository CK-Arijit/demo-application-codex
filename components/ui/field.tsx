import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

type FieldStyleOptions = Readonly<{
  invalid?: boolean;
  className?: string;
}>;

export function fieldClassName({ invalid = false, className }: FieldStyleOptions = {}): string {
  return cn(
    "w-full rounded-xl border bg-(--color-surface) px-3.5 py-2.5 text-sm text-(--color-text) outline-none transition",
    invalid
      ? "border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-(--color-border) focus:border-(--color-secondary) focus:ring-2 focus:ring-(--color-ring)",
    className
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & FieldStyleOptions;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, className, ...props }, ref) => (
    <input ref={ref} className={fieldClassName({ invalid, className })} {...props} />
  )
);

Input.displayName = "Input";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldStyleOptions;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ invalid, className, ...props }, ref) => (
    <textarea ref={ref} className={fieldClassName({ invalid, className })} {...props} />
  )
);

TextArea.displayName = "TextArea";
