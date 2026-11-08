import Link from "next/link";
import { Suspense } from "react";
import { navChips } from "../data";
import { logoutAction } from "../auth/actions";
import { fetchNavCategories } from "../lib/catalog";
import { getCurrentUser } from "../lib/session";
import { CartLink } from "./CartLink";
import { Icon, categoryIcon } from "./icons";
import { Logo } from "./Logo";

const accountLinkClass =
  "flex items-center gap-2 rounded-[var(--radius-btn)] border border-line px-5 py-2 text-sm font-semibold text-brand hover:border-brand";

function LoginLink() {
  return (
    <Link href="/auth/login" className={accountLinkClass}>
      Login
    </Link>
  );
}

/** Shows the visitor's name when signed in. Reads cookies, so it renders at request time. */
async function AccountLink() {
  const user = await getCurrentUser();
  if (!user) return <LoginLink />;
  const label = user.name?.split(" ")[0] ?? "Account";
  return (
    <>
      <Link href="/account" className={accountLinkClass}>
        <Icon name="user" width={16} height={16} />
        <span className="max-w-24 truncate">{label}</span>
      </Link>
      <form action={logoutAction}>
        <button type="submit" aria-label="Sign out" title="Sign out" className="rounded-full p-2.5 text-brand hover:bg-soft">
          <Icon name="logout" />
        </button>
      </form>
    </>
  );
}

/** The store's top-level categories, managed in the admin. Fetched at request time. */
async function CategoryLinks() {
  const categories = (await fetchNavCategories()) ?? [];
  return categories.map((c) => (
    <Link
      key={c.slug}
      href={`/shop?category=${encodeURIComponent(c.slug)}`}
      className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-brand hover:text-accent-dark"
    >
      <Icon name={categoryIcon(c.name)} width={16} height={16} className="text-accent" />
      {c.name}
    </Link>
  ));
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
        <Link href="/" aria-label="BongoMaker home" className="shrink-0">
          <Logo className="h-8 sm:h-10" />
        </Link>

        <form role="search" action="/shop" className="relative hidden flex-1 md:block">
          <input
            type="search"
            name="q"
            placeholder="Search for art supplies, paints, etc..."
            className="h-11 w-full rounded-full border border-line bg-soft pl-5 pr-14 text-sm outline-none transition focus:border-brand focus:bg-white"
          />
          <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-hover">
            <Icon name="search" width={18} height={18} />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
          <CartLink />
          <Suspense fallback={<LoginLink />}>
            <AccountLink />
          </Suspense>
        </div>
      </div>

      <nav aria-label="Categories" className="border-t border-line/60">
        <div className="no-scrollbar mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
          {navChips.map((c) => (
            <Link key={c.label} href={c.href} className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold text-brand hover:border-accent hover:text-accent-dark">
              <Icon name={c.icon} width={16} height={16} className="text-accent" />
              {c.label}
            </Link>
          ))}
          <Suspense fallback={null}>
            <CategoryLinks />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
