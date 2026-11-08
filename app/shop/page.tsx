import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "../components/ui/Button";
import {
  fetchFilters,
  fetchProducts,
  SORTS,
  type CatalogQuery,
  type FilterOption,
} from "../lib/catalog";
import { TrackEcommerce, TrackSearch } from "../components/Track";
import { cardItem, ShopCard } from "./_components/ShopCard";

export const metadata: Metadata = { title: "Shop | BongoMaker Store" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** A /shop URL with the current filters, changed by `patch`. Changing a filter goes back to page 1. */
function shopHref(current: CatalogQuery, patch: CatalogQuery) {
  const next = { ...current, page: undefined, ...patch };
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) if (value) qs.set(key, value);
  const s = qs.toString();
  return s ? `/shop?${s}` : "/shop";
}

const linkClass = (active: boolean) =>
  `flex items-center justify-between rounded-[var(--radius-btn)] px-3 py-1.5 text-sm transition ${
    active ? "bg-brand font-bold text-white" : "text-ink hover:bg-brand-soft"
  }`;

function FilterList({
  title,
  options,
  active,
  hrefFor,
}: {
  title: string;
  options: FilterOption[];
  active?: string;
  hrefFor: (slug: string | undefined) => string;
}) {
  if (options.length === 0) return null;

  // Sub categories sit under their parent, and only show once that parent (or one of them) is selected.
  const childrenOf = (slug: string) => options.filter((o) => o.parentSlug === slug);
  const rows = options
    .filter((o) => !o.parentSlug)
    .flatMap((o) => {
      const kids = childrenOf(o.slug);
      const open = active === o.slug || kids.some((k) => k.slug === active);
      return [{ option: o, indent: false }, ...(open ? kids.map((k) => ({ option: k, indent: true })) : [])];
    });

  return (
    <div>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-faint">{title}</h2>
      <ul className="space-y-0.5">
        <li>
          <Link href={hrefFor(undefined)} className={linkClass(!active)}>
            All
          </Link>
        </li>
        {rows.map(({ option: o, indent }) => (
          <li key={o.slug} className={indent ? "ml-4" : undefined}>
            <Link href={hrefFor(o.slug)} className={linkClass(active === o.slug)}>
              <span className="truncate">{o.name}</span>
              <span className={`ml-2 text-xs ${active === o.slug ? "text-white/80" : "text-faint"}`}>{o.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Shop({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const sortParam = first(sp.sort);
  const pageNumber = Number(first(sp.page));
  const query: CatalogQuery = {
    q: first(sp.q)?.trim() || undefined,
    category: first(sp.category),
    brand: first(sp.brand),
    sort: SORTS.some((s) => s.value === sortParam) ? sortParam : undefined,
    page: Number.isInteger(pageNumber) && pageNumber > 1 ? String(pageNumber) : undefined,
  };

  const [result, filters] = await Promise.all([fetchProducts(query), fetchFilters()]);
  const filtered = !!(query.q || query.category || query.brand);
  const sort = query.sort ?? "newest";
  const listName = query.q ? "Search results" : query.category ? `Category: ${query.category}` : query.brand ? `Brand: ${query.brand}` : "Shop";

  return (
    <>
      {result && result.items.length > 0 && (
        <TrackEcommerce
          event="view_item_list"
          items={result.items.map((p, i) => cardItem(p, i))}
          extra={{ item_list_name: listName }}
        />
      )}
      {query.q && result && <TrackSearch term={query.q} results={result.total} />}
      <div className="mb-6">
        <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">
          {query.q ? `Results for "${query.q}"` : "Shop"}
        </h1>
        <div className="mt-1.5 h-1 w-24 rounded-full bg-accent" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <form action="/shop" role="search" className="flex gap-2">
            {query.category && <input type="hidden" name="category" value={query.category} />}
            {query.brand && <input type="hidden" name="brand" value={query.brand} />}
            {query.sort && <input type="hidden" name="sort" value={query.sort} />}
            <input
              name="q"
              defaultValue={query.q}
              placeholder="Search products"
              className="min-w-0 flex-1 rounded-[var(--radius-btn)] border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <Button type="submit" size="sm">
              Go
            </Button>
          </form>
          {filters && (
            <>
              <FilterList
                title="Categories"
                options={filters.categories}
                active={query.category}
                hrefFor={(slug) => shopHref(query, { category: slug })}
              />
              <FilterList
                title="Brands"
                options={filters.brands}
                active={query.brand}
                hrefFor={(slug) => shopHref(query, { brand: slug })}
              />
            </>
          )}
          {filtered && (
            <Link href="/shop" className="inline-block text-sm font-semibold text-accent-dark hover:underline">
              Clear all filters
            </Link>
          )}
        </aside>

        <section>
          {!result ? (
            <p className="rounded-[var(--radius-card)] border border-line bg-white p-8 text-center text-muted">
              The shop could not be loaded right now. Please try again in a moment.
            </p>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">
                  {result.total} product{result.total === 1 ? "" : "s"}
                </p>
                <nav aria-label="Sort" className="flex flex-wrap items-center gap-1.5 text-sm">
                  <span className="text-faint">Sort:</span>
                  {SORTS.map((s) => (
                    <Link
                      key={s.value}
                      href={shopHref(query, { sort: s.value === "newest" ? undefined : s.value })}
                      aria-current={sort === s.value ? "true" : undefined}
                      className={`rounded-full px-3 py-1 font-semibold transition ${
                        sort === s.value ? "bg-brand text-white" : "text-brand hover:bg-brand-soft"
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {result.items.length === 0 ? (
                <p className="rounded-[var(--radius-card)] border border-line bg-white p-8 text-center text-muted">
                  {filtered ? "No products match your filters." : "No products yet. Check back soon."}
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
                  {result.items.map((p, i) => (
                    <li key={p.id} className="flex">
                      <div className="flex-1">
                        <ShopCard p={p} list={listName} index={i} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {result.pages > 1 && (
                <nav aria-label="Pages" className="mt-10 flex items-center justify-center gap-3">
                  {result.page > 1 && (
                    <Button href={shopHref(query, { page: String(result.page - 1) })} variant="outline" size="sm">
                      Previous
                    </Button>
                  )}
                  <span className="text-sm text-muted">
                    Page {result.page} of {result.pages}
                  </span>
                  {result.page < result.pages && (
                    <Button href={shopHref(query, { page: String(result.page + 1) })} variant="outline" size="sm">
                      Next
                    </Button>
                  )}
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
      <Shop searchParams={searchParams} />
    </Suspense>
  );
}
