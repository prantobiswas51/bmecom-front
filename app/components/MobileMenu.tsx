"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { logoutAction } from "../auth/actions";
import { Icon } from "./icons";

const accountLinks = [
  { href: "/account", label: "Overview", icon: "user" },
  { href: "/account/orders", label: "My orders", icon: "bag" },
  { href: "/account/addresses", label: "My addresses", icon: "pin" },
  { href: "/account/profile", label: "Profile & security", icon: "shield" },
] as const;

const rowClass =
  "flex items-center gap-3 rounded-[var(--radius-btn)] px-4 py-3 text-sm font-semibold text-brand hover:bg-soft";

/**
 * Phones only: the three-bar button in the header and the drawer it opens from the right, with search
 * (the header has no room for it) and the visitor's account links, or Login when signed out.
 * `name` is null when nobody is signed in.
 */
export function MobileMenu({ name }: { name: string | null }) {
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

  const close = () => setOpen(false);

  // The header blurs what is behind it, which would trap a fixed drawer inside the header's own box,
  // so the drawer is drawn straight into <body> instead.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const drawer = (
    <div className="md:hidden">
      {/* Dimmed page behind the drawer; tapping it closes the drawer. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <nav
        aria-label="Menu"
        className={`fixed inset-y-0 right-0 z-[60] flex w-[85%] max-w-xs flex-col gap-1 overflow-y-auto bg-white p-5 shadow-xl transition-[transform,visibility] duration-300 ${
          open ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand">{name ? `Hi, ${name.split(" ")[0]}` : "Menu"}</h2>
          <button type="button" onClick={close} aria-label="Close menu" className="rounded-full p-2 text-brand hover:bg-soft">
            <Icon name="close" />
          </button>
        </div>

        <form role="search" action="/shop" onSubmit={close} className="relative mb-3">
          <input
            type="search"
            name="q"
            placeholder="Search products and blog posts..."
            className="h-11 w-full rounded-full border border-line bg-soft pl-5 pr-14 text-sm outline-none transition focus:border-brand focus:bg-white"
          />
          <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-hover">
            <Icon name="search" width={18} height={18} />
          </button>
        </form>

        {name ? (
          <>
            {accountLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className={rowClass}>
                <Icon name={l.icon} width={18} height={18} />
                {l.label}
              </Link>
            ))}
            <form action={logoutAction} className="mt-3 border-t border-line pt-4">
              <button type="submit" className={`${rowClass} w-full`}>
                <Icon name="logout" width={18} height={18} />
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/auth/login" onClick={close} className={rowClass}>
              <Icon name="user" width={18} height={18} />
              Login
            </Link>
            <Link href="/auth/signup" onClick={close} className={rowClass}>
              <Icon name="spark" width={18} height={18} />
              Create an account
            </Link>
          </>
        )}
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="rounded-full p-2.5 text-brand hover:bg-soft md:hidden"
      >
        <Icon name="menu" />
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
