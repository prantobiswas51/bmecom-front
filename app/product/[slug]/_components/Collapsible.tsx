"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * A titled section whose body can be folded away. It starts open, and opens again when the address
 * points at it (for example the rating link under the product name jumps to #reviews).
 */
export function Collapsible({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!id) return;
    const openIfTargeted = () => location.hash === `#${id}` && setOpen(true);
    window.addEventListener("hashchange", openIfTargeted);
    return () => window.removeEventListener("hashchange", openIfTargeted);
  }, [id]);

  const bodyId = `${id ?? title.toLowerCase().replace(/\s+/g, "-")}-body`;

  return (
    <section id={id} className="min-w-0 scroll-mt-40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="group flex w-full items-center justify-between gap-4 text-left"
      >
        <span>
          <span className="block text-[1.375rem] font-bold text-brand sm:text-2xl">{title}</span>
          <span className="mt-1.5 block h-1 w-20 rounded-full bg-accent" />
        </span>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-brand transition group-hover:border-brand ${open ? "rotate-180" : ""}`}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div id={bodyId} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
