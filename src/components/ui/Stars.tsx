import { Star } from "lucide-react";
import { cn } from "../../lib/cn";

interface StarsProps {
  value: number;
  onChange?: (value: number) => void;
  label: string;
}

/** Five-star rating. Read-only unless onChange is given. */
export function Stars({ value, onChange, label }: StarsProps) {
  return (
    <div className="flex" role={onChange ? "radiogroup" : "img"} aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = <Star className={cn("h-5 w-5", n <= value ? "fill-sun text-sun" : "text-muted-foreground")} />;
        return onChange ? (
          <button key={n} type="button" onClick={() => onChange(n === value ? 0 : n)} aria-label={`${n} / 5`} className="grid h-11 w-9 place-items-center">
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </div>
  );
}
