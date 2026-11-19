"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../../components/icons";

const links = [
  { href: "/account", label: "Overview", icon: "user", exact: true },
  { href: "/account/orders", label: "My orders", icon: "bag" },
  { href: "/account/addresses", label: "My addresses", icon: "pin" },
  { href: "/account/profile", label: "Profile & security", icon: "shield" },
] as const;

/** The account menu down the left side of large screens. On phones the same links are in the header's three-bar menu. */
export function AccountNav() {
  const path = usePathname();
  return (
    <nav aria-label="Account" className="flex flex-col gap-1">
      {links.map((l) => {
        const active = "exact" in l ? path === l.href : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-[var(--radius-btn)] px-4 py-2.5 text-sm font-semibold transition ${
              active ? "bg-brand text-white" : "text-brand hover:bg-soft"
            }`}
          >
            <Icon name={l.icon} width={18} height={18} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
