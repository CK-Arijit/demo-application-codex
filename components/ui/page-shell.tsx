import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

type PageShellProps = Readonly<{
  children: ReactNode;
  className?: string;
  stackClassName?: string;
}> &
  Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function PageShell({ children, className, stackClassName, ...props }: PageShellProps) {
  return (
    <main className={cn("min-h-screen px-4 py-8 sm:px-6 lg:px-8", className)} {...props}>
      <div className={cn("mx-auto flex w-full max-w-5xl flex-col gap-6", stackClassName)}>
        {children}
      </div>
    </main>
  );
}
