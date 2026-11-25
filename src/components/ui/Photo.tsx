import { useState } from "react";
import { cn } from "../../lib/cn";

interface PhotoProps {
  src?: string;
  alt: string;
  gradient?: string;
  className?: string;
}

/** Image with a gradient fallback when the photo is missing or fails to load. */
export function Photo({ src, alt, gradient, className }: PhotoProps) {
  const [failed, setFailed] = useState(false);
  const fallback = gradient ?? "linear-gradient(150deg, oklch(0.5 0.08 200), oklch(0.74 0.13 60))";
  if (!src || failed) {
    return <div role="img" aria-label={alt} className={className} style={{ background: fallback }} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
