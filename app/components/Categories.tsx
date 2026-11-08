import Link from "next/link";
import { fetchFilters } from "../lib/catalog";
import { Section } from "./Section";
import { Icon, categoryIcon } from "./icons";

/** Each card gets its own soft colour, cycling through the palette. */
const TILES = ["bg-brand-soft text-brand", "bg-accent-soft text-accent-dark", "bg-success-soft text-success", "bg-soft text-brand"];

/** The store's top-level categories with their product counts, straight from the catalog. */
export async function Categories() {
  const filters = await fetchFilters();
  const categories = (filters?.categories ?? []).filter((c) => !c.parentSlug && c.count > 0);
  if (categories.length === 0) return null;

  return (
    <Section
      id="categories"
      title="Our Collection"
      subtitle="Explore our wide range of art supplies for every artist"
      cta="Shop everything"
      href="/shop"
    >
      <div className="rounded-[var(--radius-card)] bg-soft p-4 sm:p-6">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/shop?category=${encodeURIComponent(c.slug)}`}
                className="group flex items-center gap-4 overflow-hidden rounded-[var(--radius-card)] bg-white p-3 pr-5 transition hover:shadow-card"
              >
                <span
                  className={`flex h-24 w-28 shrink-0 items-center justify-center rounded-[1.75rem] rounded-tl-[2.5rem] sm:h-28 sm:w-32 ${TILES[i % TILES.length]}`}
                >
                  <Icon name={categoryIcon(c.name)} width={40} height={40} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold text-brand">{c.name}</h3>
                  <div className="my-1.5 h-0.5 w-8 rounded-full bg-accent" />
                  <p className="text-xs text-muted">
                    {c.count} product{c.count === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-sm transition group-hover:bg-brand group-hover:text-white">
                  <Icon name="arrow" width={16} height={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
