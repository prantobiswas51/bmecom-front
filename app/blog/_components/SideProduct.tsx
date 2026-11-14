import { Price } from "../../components/Price";
import { ProductLink } from "../../components/Track";
import { imageUrl, type CatalogCard } from "../../lib/catalog";
import { cardItem } from "../../shop/_components/ShopCard";

/** A compact row for the blog sidebar: small photo on the left, name and price on the right. */
export function SideProduct({ p, index }: { p: CatalogCard; index: number }) {
  return (
    <ProductLink
      href={`/product/${p.slug}`}
      list="Blog sidebar"
      item={cardItem(p, index)}
      className="group flex items-center gap-4"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-btn)] border border-line bg-surface">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- photos come from the API host, not a fixed domain
          <img src={imageUrl(p.image)} alt={p.imageAlt ?? p.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] font-semibold text-faint">No photo</div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-accent-dark">{p.name}</h3>
        <p className="mt-1 text-sm font-extrabold text-accent-dark">
          {p.upcoming && p.priceFrom === 0 ? (
            <span className="font-semibold text-muted">Coming soon</span>
          ) : (
            <>
              {p.priceFrom !== p.priceTo && <span className="mr-1 text-xs font-semibold text-muted">From</span>}
              <Price value={p.priceFrom} />
            </>
          )}
        </p>
      </div>
    </ProductLink>
  );
}
