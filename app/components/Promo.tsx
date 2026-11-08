import Link from "next/link";
import { fetchFilters } from "../lib/catalog";

/** The brands that have products in the shop; each links to that brand's products. */
export async function Brands() {
  const brands = ((await fetchFilters())?.brands ?? []).filter((b) => b.count > 0).slice(0, 16);
  if (brands.length === 0) return null;

  return (
    <section aria-label="Brands" className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-faint">Brands we stock</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {brands.map((b) => (
          <li key={b.slug}>
            <Link
              href={`/shop?brand=${encodeURIComponent(b.slug)}`}
              className="flex h-16 items-center justify-center rounded-2xl border border-line bg-white px-2 text-center text-sm font-extrabold uppercase tracking-wider text-brand/60 transition hover:border-accent hover:text-brand"
            >
              {b.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
