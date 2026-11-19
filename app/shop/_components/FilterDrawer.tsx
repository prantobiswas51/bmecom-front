"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Icon } from "../../components/icons";

/**
 * The shop's filters. On large screens they are a card beside the products; on phones they are hidden
 * behind a "Filters" button and slide in from the left. The button and the panel are separate pieces
 * (so the button can sit next to the page title) that share this open/closed state.
 */
const Open = createContext<[boolean, (open: boolean) => void]>([false, () => {}]);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Escape closes it, and the page behind does not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return <Open.Provider value={[open, setOpen]}>{children}</Open.Provider>;
}

/** Phones only. Shows how many filters are on. */
export function FilterButton({ activeCount }: { activeCount: number }) {
  const [open, setOpen] = useContext(Open);
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={open}
      className="flex shrink-0 items-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-4 py-2 text-sm font-semibold text-brand hover:border-brand lg:hidden"
    >
      <Icon name="layers" width={16} height={16} />
      Filters
      {activeCount > 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">{activeCount}</span>}
    </button>
  );
}

export function FilterPanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useContext(Open);
  return (
    <>
      {/* Dimmed page behind the drawer; tapping it closes the drawer. */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        aria-label="Filters"
        // Choosing a filter is a link, so the drawer closes as the new results load.
        onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
        className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm space-y-6 overflow-y-auto bg-white p-5 shadow-xl transition-[transform,visibility] duration-300 lg:visible lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:self-start lg:overflow-visible lg:rounded-[var(--radius-card)] lg:border lg:border-line lg:shadow-none ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-bold text-brand">Filters</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close filters" className="rounded-full p-2 text-brand hover:bg-soft">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
