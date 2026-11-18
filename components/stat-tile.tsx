import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: LucideIcon;
  title: string;
  value: string;
  hint?: string;
  color?: string;
  /** 0–100: desenha uma barrinha de nível embaixo do valor. */
  meter?: number;
  className?: string;
}

/** Bloco de informação com altura fixa, para que todos fiquem do mesmo tamanho na grade. */
export function StatTile({ icon: Icon, title, value, hint, color = "text-sky-500", meter, className }: StatTileProps) {
  return (
    <div className={cn("flex h-full min-h-[104px] flex-col justify-between gap-2 rounded-xl border bg-card p-3.5", className)}>
      <dt className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className={cn("h-4 w-4 shrink-0", color)} />
        <span className="truncate">{title}</span>
      </dt>
      <dd className="min-w-0">
        <p className="truncate text-lg font-semibold tabular-nums leading-tight">{value}</p>
        {typeof meter === "number" ? (
          <div className={cn("mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted", color)} aria-hidden>
            <div className="h-full rounded-full bg-current opacity-70" style={{ width: `${Math.min(100, Math.max(0, meter))}%` }} />
          </div>
        ) : null}
        {hint ? <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p> : null}
      </dd>
    </div>
  );
}
