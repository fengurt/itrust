import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  title?: string;
};

export function Card({ children, title, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[color:var(--color-ink)]/15 bg-[color:var(--color-surface)] p-6 shadow-sm ${className}`}
      {...rest}
    >
      {title ? (
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[color:var(--color-ink)]">
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  );
}
