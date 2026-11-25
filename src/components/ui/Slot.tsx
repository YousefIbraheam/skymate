import { cloneElement, isValidElement, type HTMLAttributes, type ReactElement } from "react";
import { cn } from "../../lib/cn";

/** Minimal "asChild" helper: merges props and classes onto the single child element. */
export function Slot({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  if (!isValidElement(children)) return null;
  const child = children as ReactElement<{ className?: string }>;
  return cloneElement(child, { ...props, className: cn(className, child.props.className) } as object);
}
