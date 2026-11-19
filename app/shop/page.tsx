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
import { toDefaults } from "../lib/address";
import { fetchAddresses } from "../lib/addresses";
import { getCurrentUser } from "../lib/session";
import { Icon } from "../components/icons";
import { CardActions } from "./_components/CardActions";
import { FilterButton, FilterPanel, FilterProvider } from "./_components/FilterDrawer";
import { PriceFilter } from "./_components/PriceFilter";
import { fetchBlogPosts } from "../lib/blog";
import { BlogMatches } from "./_components/BlogMatches";
import { cardItem, ShopCard } from "./_components/ShopCard";

export const metadata: Metadata = { title: "Shop | BongoMaker Store" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** "a,b" from the address as ["a", "b"]. */
const listOf = (v: string | undefined) => (v ?? "").split(",").filter(Boolean);

/** A /shop URL with the current filters, changed by `patch`. Changing a filter goes back to page 1. */
function shopHref(current: CatalogQuery, patch: CatalogQuery) {
  const next = { ...current, page: undefined, ...patch };
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) if (value) qs.set(key, value);
  const s = qs.toString();
  return s ? `/shop?${s}` : "/shop";
}

/** A checkbox-style row. Ticking several in a list shows products from any of them. */
function Row({ href, on, label, count }: { href: string; on: boolean; label: string; count?: number }) {
  return (
    <Link href={href} aria-current={on ? "true" : undefined} className="group flex items-center gap-3 py-1.5 text-sm">
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
          on ? "border-brand bg-brand text-white" : "border-line bg-white group-hover:border-brand"
        }`}
      >
        {on && <Icon name="check" width={14} height={14} strokeWidth={3} />}
      </span>
      <span className={`min-w-0 flex-1 truncate ${on ? "font-bold text-brand" : "text-muted group-hover:text-ink"}`}>{label}</span>
      {count !== undefined && <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-semibold text-muted">{count}</span>}
    </Link>
  );
}

function FilterList({
  title,
  icon,
  options,
  active,
  hrefFor,
}: {
  title: string;
  icon: "layers" | "tag";
  options: FilterOption[];
  /** The slugs that are ticked; none means "All". */
  active: string[];
  /** The address with these slugs ticked. */
  hrefFor: (slugs: string[]) => string;
}) {
  if (options.length === 0) return null;
  const toggled = (slug: string) => hrefFor(active.includes(slug) ? active.filter((s) => s !== slug) : [...active, slug]);

  // Sub categories sit under their parent, and only show once that parent (or one of them) is selected.
  const childrenOf = (slug: string) => options.filter((o) => o.parentSlug === slug);
  const rows = options
    .filter((o) => !o.parentSlug)
    .flatMap((o) => {
      const kids = childrenOf(o.slug);
      const open = active.includes(o.slug) || kids.some((k) => active.includes(k.slug));
      return [{ option: o, indent: false }, ...(open ? kids.map((k) => ({ option: k, indent: true })) : [])];
    });

  return (
    <div>
      <h2 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.06em] text-ink">
        <Icon name={icon} width={16} height={16} className="text-brand" />
        {title}
      </h2>
      <ul>
        <li>
          <Row href={hrefFor([])} on={active.length === 0} label="All" />
        </li>
        {rows.map(({ option: o, indent }) => (
          <li key={o.slug} className={indent ? "ml-6" : undefined}>
            <Row href={toggled(o.slug)} on={active.includes(o.slug)} label={o.name} count={o.count} />
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
    maxPrice: Number.isInteger(Number(first(sp.maxPrice))) && Number(first(sp.maxPrice)) > 0 ? first(sp.maxPrice) : undefined,
    sort: SORTS.some((s) => s.value === sortParam) ? sortParam : undefined,
    page: Number.isInteger(pageNumber) && pageNumber > 1 ? String(pageNumber) : undefined,
  };

  const [[result, filters], user, addresses, blog] = await Promise.all([
    Promise.all([fetchProducts(query), fetchFilters()]),
    getCurrentUser(),
    fetchAddresses(),
    // A search also looks through the blog; only the first page of posts shows here.
    query.q && !query.page ? fetchBlogPosts(1, query.q) : null,
  ]);
  const defaults = toDefaults(addresses[0], user?.name); // pre-fills the quick order form
  const filtered = !!(query.q || query.category || query.brand || query.maxPrice);
  const sort = query.sort ?? "newest";
  const listName = query.q ? "Search results" : query.category ? `Category: ${query.category}` : query.brand ? `Brand: ${query.brand}` : "Shop";

  return (
    <FilterProvider>
      {result && result.items.length > 0 && (
        <TrackEcommerce
          event="view_item_list"
          items={result.items.map((p, i) => cardItem(p, i))}
          extra={{ item_list_name: listName }}
        />
      )}
      {query.q && result && <TrackSearch term={query.q} results={result.total} />}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">
            {query.q ? `Results for "${query.q}"` : "Shop"}
          </h1>
          <div className="mt-1.5 h-1 w-24 rounded-full bg-accent" />
        </div>
        {/* Phones: the button that opens the filter drawer sits on the title's row. */}
        <FilterButton activeCount={listOf(query.category).length + listOf(query.brand).length + (query.maxPrice ? 1 : 0)} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <FilterPanel>
          <form action="/shop" role="search" className="flex gap-2">
            {query.category && <input type="hidden" name="category" value={query.category} />}
            {query.brand && <input type="hidden" name="brand" value={query.brand} />}
            {query.maxPrice && <input type="hidden" name="maxPrice" value={query.maxPrice} />}
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
                icon="layers"
                options={filters.categories}
                active={listOf(query.category)}
                hrefFor={(slugs) => shopHref(query, { category: slugs.join(",") || undefined })}
              />
              <div className="border-t border-line pt-5">
                <FilterList
                  title="Brands"
                  icon="tag"
                  options={filters.brands}
                  active={listOf(query.brand)}
                  hrefFor={(slugs) => shopHref(query, { brand: slugs.join(",") || undefined })}
                />
              </div>
              {filters.maxPrice > 0 && (
                <div className="border-t border-line pt-5">
                  {/* Re-mounted when the limit changes from outside (e.g. "Clear all filters"). */}
                  <PriceFilter key={query.maxPrice ?? "all"} max={filters.maxPrice} value={query.maxPrice ? Number(query.maxPrice) : undefined} baseHref={shopHref(query, { maxPrice: undefined })} />
                </div>
              )}
            </>
          )}
          {filtered && (
            <Link href="/shop" className="inline-block text-sm font-semibold text-accent-dark hover:underline">
              Clear all filters
            </Link>
          )}
        </FilterPanel>

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
                        <ShopCard p={p} list={listName} index={i} actions={<CardActions p={p} defaults={defaults} />} />
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

              {query.q && blog && <BlogMatches posts={blog.items.slice(0, 6)} term={query.q} />}
            </>
          )}
        </section>
      </div>
    </FilterProvider>
  );
}

export default function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
      <Shop searchParams={searchParams} />
    </Suspense>
  );
}
