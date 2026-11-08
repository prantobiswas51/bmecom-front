import { ProductLink } from "../../components/Track";
import { Price } from "../../components/Price";
import { imageUrl, type CatalogCard } from "../../lib/catalog";
import type { GtmItem } from "../../lib/gtm";

/** A product tile as a tracking item. */
export const cardItem = (p: CatalogCard, index?: number): GtmItem => ({
  item_id: p.id,
  item_name: p.name,
  price: p.priceFrom,
  ...(p.brand && { item_brand: p.brand.name }),
  ...(p.category && { item_category: p.category.name }),
  ...(index !== undefined && { index }),
});

/** A product tile. `list` and `index` say where it is shown, for click tracking. */
export function ShopCard({ p, list = "Shop", index }: { p: CatalogCard; list?: string; index?: number }) {
  return (
    <article className="group flex flex-col">
      <ProductLink
        href={`/product/${p.slug}`}
        className="block"
        list={list}
        item={cardItem(p, index)}
      >
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- photos come from the API host, not a fixed domain
            <img
              src={imageUrl(p.image)}
              alt={p.imageAlt ?? p.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-faint">No photo</div>
          )}
          {p.upcoming ? (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
              Upcoming
            </span>
          ) : (
            p.grouped && (
              <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
                Options
              </span>
            )
          )}
        </div>
        <div className="mt-3">
          {p.category && (
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-faint">{p.category.name}</p>
          )}
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-ink group-hover:text-accent-dark">{p.name}</h3>
          {p.brand && <p className="mt-0.5 text-xs text-muted">{p.brand.name}</p>}
          <p className="mt-2 text-base font-extrabold text-brand">
            {p.upcoming && p.priceFrom === 0 ? (
              <span className="text-sm font-semibold text-muted">Coming soon</span>
            ) : (
              <>
                {p.priceFrom !== p.priceTo && <span className="mr-1 text-xs font-semibold text-muted">From</span>}
                <Price value={p.priceFrom} />
              </>
            )}
          </p>
        </div>
      </ProductLink>
    </article>
  );
}
