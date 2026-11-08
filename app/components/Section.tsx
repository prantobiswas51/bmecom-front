import type { ReactNode } from "react";
import { Button } from "./ui/Button";

/** Standard section wrapper: container, title with orange bar, subtitle and a "view all" link. */
export function Section({
  id,
  title,
  subtitle,
  cta,
  href,
  children,
  className = "",
}: {
  id?: string;
  title: string;
  subtitle?: string;
  /** The "view all" button's label; it only shows together with `href`. */
  cta?: string;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 ${className}`}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">{title}</h2>
          <div className="mt-1.5 h-1 w-24 rounded-full bg-accent" />
          {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
        </div>
        {cta && href && (
          <Button href={href} iconRight="arrow" className="hidden shrink-0 sm:inline-flex">
            {cta}
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}
