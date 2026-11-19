"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/icons";

export type SortOption = { label: string; href: string; active: boolean };

/** Phones only: a "Sort" button that drops down the sort choices (large screens show them inline). */
export function SortMenu({ options }: { options: SortOption[] }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Tapping elsewhere or pressing Escape closes it.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={box} className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-4 py-2 text-sm font-semibold text-brand hover:border-brand"
      >
        <Icon name="sort" width={16} height={16} />
        Sort
      </button>
      {open && (
        <ul role="menu" className="absolute right-0 top-full z-30 mt-2 w-52 rounded-[var(--radius-card)] border border-line bg-white p-1.5 shadow-xl">
          {options.map((o) => (
            <li key={o.label} role="none">
              <Link
                role="menuitem"
                href={o.href}
                onClick={() => setOpen(false)}
                aria-current={o.active ? "true" : undefined}
                className={`flex items-center justify-between rounded-[var(--radius-btn)] px-3 py-2.5 text-sm font-semibold ${
                  o.active ? "bg-brand-soft text-brand" : "text-ink hover:bg-soft"
                }`}
              >
                {o.label}
                {o.active && <Icon name="check" width={16} height={16} strokeWidth={3} />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
