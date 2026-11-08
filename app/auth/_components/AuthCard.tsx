import type { ReactNode } from "react";

/** Heading, form area and the "switch to the other page" line shared by every auth page. */
export function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <h1 className="text-[1.75rem] font-extrabold leading-tight text-brand sm:text-[2rem]">{title}</h1>
      <div className="mt-2 h-1 w-12 rounded-full bg-accent" />
      {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
      <div className="mt-7">{children}</div>
      {footer && <p className="mt-7 text-center text-sm text-muted">{footer}</p>}
    </section>
  );
}

export const linkClass = "font-semibold text-brand underline-offset-4 hover:text-accent-dark hover:underline";
