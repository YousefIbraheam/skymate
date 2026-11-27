import { useState } from "react";
import { Sun } from "lucide-react";
import { bestMonths, facts, getDestination } from "../data";
import { useI18n } from "../i18n";
import { cn } from "../lib/cn";

/** Contiguous [start, end] month ranges from a month list, wrapping around the year: [10,11,12,1,2,3] -> [[10,4]]. */
function monthRanges(months: number[]): [number, number][] {
  const set = new Set(months);
  return months
    .filter((mo) => !set.has(((mo + 10) % 12) + 1))
    .map((start) => {
      let end = start;
      while (set.has((end % 12) + 1)) end = (end % 12) + 1;
      return [start, end];
    });
}

/** Best-time-to-visit view for a destination: season pill, month grid with the good months marked, and climate notes. */
export function BestTime({ destinationId, className = "" }: { destinationId: string; className?: string }) {
  const { m, lang } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const locale = lang === "ar" ? "ar" : "en-US";
  const destination = getDestination(destinationId);
  if (!destination) return null;

  const good = bestMonths[destination.id] ?? [];
  const info = facts[destination.id];
  const current = new Date().getMonth() + 1;
  const monthName = (i: number, style: "short" | "long") =>
    new Date(2024, i - 1, 1).toLocaleDateString(locale, { month: style });
  const season = monthRanges(good)
    .map(([s, e]) => `${monthName(s, "long")} – ${monthName(e, "long")}`)
    .join(" · ");

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-semibold">{m.destination.bestTime}</h2>
      <div className="flex flex-wrap items-center gap-3">
        {season && (
          <span className="inline-flex items-center gap-2 rounded-full bg-sun px-3 py-1 text-sm font-semibold text-sun-foreground">
            <Sun className="h-4 w-4" /> {season}
          </span>
        )}
        <span className="text-lg font-semibold">{destination.bestTime}</span>
      </div>
      <div className="grid grid-cols-[repeat(6,minmax(0,1fr))] gap-2 sm:grid-cols-[repeat(12,minmax(0,1fr))]">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((mo) => (
          <button
            key={mo}
            type="button"
            aria-current={mo === current ? "date" : undefined}
            aria-pressed={selected === mo}
            onClick={() => setSelected(selected === mo ? null : mo)}
            className={cn(
              "min-w-0 overflow-hidden rounded-xl px-1 py-2 text-center text-xs font-semibold transition-shadow",
              good.includes(mo) ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground",
              mo === current && "ring-2 ring-primary",
              selected === mo && "ring-2 ring-sun",
            )}
          >
            {monthName(mo, "short")}
          </button>
        ))}
      </div>
      {selected ? (
        <div className="rounded-2xl bg-muted p-4">
          <p className="text-sm font-semibold">
            {monthName(selected, "short")} · {good.includes(selected) ? m.destination.monthGood : m.destination.monthOff}
          </p>
          {info && <p className="mt-1 text-sm text-muted-foreground">{info.climate}</p>}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{m.destination.monthHint}</p>
      )}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-emerald-600" /> {m.destination.bestMonthsLegend}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm ring-2 ring-primary" /> {m.destination.thisMonth}</span>
      </div>
      {info && <p className="text-sm text-muted-foreground">{info.climate} {info.summary}</p>}
      <p className="text-xs text-muted-foreground">{m.destination.bestTimeNote}</p>
    </div>
  );
}
