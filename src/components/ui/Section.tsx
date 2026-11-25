import type { ReactNode } from "react";

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-4xl font-semibold">{title}</h1>
      {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-card p-5 shadow-soft ${className}`}>{children}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="rounded-3xl bg-muted p-6 text-center text-sm text-muted-foreground">{children}</p>;
}
