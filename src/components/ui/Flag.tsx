import { useState } from "react";
import { cn } from "../../lib/cn";

interface FlagProps {
  /** ISO 3166-1 alpha-2 code, e.g. "IN", "SA", "US", "DE". */
  code: string;
  className?: string;
}

/**
 * Country flag as an image. Flag emoji do not render on Windows,
 * so we load a small PNG instead and fall back to the code text.
 */
export function Flag({ code, className }: FlagProps) {
  const [failed, setFailed] = useState(false);
  const lower = code.toLowerCase();
  if (failed) return <span className={cn("text-xs font-semibold", className)}>{code.toUpperCase()}</span>;
  return (
    <img
      src={`https://flagcdn.com/w40/${lower}.png`}
      srcSet={`https://flagcdn.com/w80/${lower}.png 2x`}
      alt=""
      aria-hidden
      width={24}
      height={16}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("inline-block h-4 w-6 rounded-[3px] object-cover shadow-sm ring-1 ring-black/10", className)}
    />
  );
}
