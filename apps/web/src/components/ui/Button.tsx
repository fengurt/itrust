import type { ButtonHTMLAttributes, ReactNode } from "react";

export const buttonBaseClassName =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)] disabled:pointer-events-none disabled:opacity-50";

const baseClass = buttonBaseClassName;

const variants = {
  primary:
    "bg-[color:var(--color-accent)] text-[color:var(--color-surface)] hover:brightness-95 active:bg-[color:var(--color-accent)]/90",
  secondary:
    "border border-[color:var(--color-ink)] bg-transparent text-[color:var(--color-ink)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-ink)] active:bg-[color:var(--color-accent-muted)]",
  ghost:
    "border border-transparent text-[color:var(--color-ink)] hover:border-[color:var(--color-ink)]/20 active:bg-[color:var(--color-accent-muted)]",
} as const;

export const buttonVariantClassNames: Record<keyof typeof variants, string> = variants;

export type ButtonVariant = keyof typeof variants;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}
