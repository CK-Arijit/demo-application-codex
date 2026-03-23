import type { ReactNode } from "react";
import { cn } from "./cn";
import { EyebrowText } from "./typography";

type InfoTileProps = Readonly<{
  label: string;
  value: ReactNode;
  className?: string;
}>;

export function InfoTile({ label, value, className }: InfoTileProps) {
  return (
    <div className={cn("rounded-2xl bg-(--color-surface-soft) p-4", className)}>
      <EyebrowText className="text-xs font-medium tracking-wide text-(--color-muted)">
        {label}
      </EyebrowText>
      <p className="mt-2 text-sm font-semibold text-(--color-primary)">{value}</p>
    </div>
  );
}
