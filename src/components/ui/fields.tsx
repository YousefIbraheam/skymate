import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export const inputClass =
  "h-11 w-full rounded-full border border-input bg-card px-4 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("min-h-24 w-full rounded-2xl border border-input bg-card p-4 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring", className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 rounded-full border bg-card px-4 text-sm", className)} {...props} />;
}
