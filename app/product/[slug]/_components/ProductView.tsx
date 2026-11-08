"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { QtyStepper } from "../../../cart/_components/QtyStepper";
import { Button } from "../../../components/ui/Button";
import { Price } from "../../../components/Price";
import { TrackEcommerce } from "../../../components/Track";
import { useCurrencyCode } from "../../../components/Price";
import { addToCart } from "../../../lib/cart";
import { trackEcommerce, type GtmItem } from "../../../lib/gtm";
import type { Defaults } from "../../../lib/address";
import { imageUrl, type ProductDetail } from "../../../lib/catalog";
import { BuyNowModal } from "./BuyNowModal";

type Attributes = Record<string, string>;

const sameValue = (a: Attributes, b: Attributes) => Object.keys(a).every((k) => a[k] === b[k]);

// The up/down arrows beside the thumbnails (desktop only; phones scroll sideways).
// Brand and category links in the details box.
const chip =
  "inline-block rounded-[var(--radius-btn)] border border-line bg-white px-2.5 py-0.5 text-xs font-semibold text-brand transition hover:border-brand hover:bg-brand hover:text-white";
const arrowClass = "hidden h-6 shrink-0 items-center justify-center text-lg font-bold leading-none text-brand hover:text-accent-dark lg:flex";

export function ProductView({ product: p, initialVariant, rating, defaults }: { product: ProductDetail; initialVariant?: string; rating?: ReactNode; defaults?: Defaults }) {
  const grouped = p.variants.length > 0;
  const [picked, setPicked] = useState<Attributes>(
    () => (p.variants.find((v) => v.slug === initialVariant) ?? p.variants[0])?.attributes ?? {},
  );
  // Which thumbnail was clicked, and for which variant: switching variant starts again from its first photo.
  const [thumb, setThumb] = useState<{ variantId: string | null; index: number }>({ variantId: null, index: 0 });

  const variant = grouped ? p.variants.find((v) => sameValue(v.attributes, picked) && sameValue(picked, v.attributes)) : undefined;
  const price = variant?.price ?? p.priceFrom;
  const currency = useCurrencyCode();
  const trackItem = (quantity?: number): GtmItem => ({
    item_id: p.id,
    item_name: p.name,
    price,
    ...(quantity && { quantity }),
    ...(p.brand && { item_brand: p.brand.name }),
    ...(p.category && { item_category: p.category.name }),
    ...(variant && { item_variant: Object.values(variant.attributes).join(" / ") }),
  });

  const strip = useRef<HTMLUListElement>(null);
  // One thumbnail at a time: the strip shows three, so a step is a third of its height.
  const scrollThumbs = (dir: 1 | -1) => {
    const el = strip.current;
    if (el) el.scrollBy({ top: dir * (el.clientHeight / 3 + 3), behavior: "smooth" });
  };

  const [buying, setBuying] = useState(false);
  const [quantity, setQuantityRaw] = useState(1);
  const [added, setAdded] = useState(false);
  const setQuantity = (q: number) => {
    setQuantityRaw(q);
    setAdded(false);
  };
  // A grouped product can only be bought once a full combination is picked.
  const orderable = !grouped || !!variant;

  // The chosen variant's own photos lead, followed by the ones every variant shares.
  const own = p.images.filter((i) => variant && i.variantId === variant.id);
  const shared = p.images.filter((i) => !i.variantId);
  const gallery = own.length + shared.length > 0 ? [...own, ...shared] : p.images;
  const index = thumb.variantId === (variant?.id ?? null) ? Math.min(thumb.index, gallery.length - 1) : 0;
  const main = gallery[index];

  function choose(axis: string, value: string) {
    // Prefer a variant that keeps the other choices; otherwise the first one with this value.
    const next =
      p.variants.find((v) => v.attributes[axis] === value && sameValue({ ...picked, [axis]: value }, v.attributes)) ??
      p.variants.find((v) => v.attributes[axis] === value);
    if (!next) return;
    setPicked(next.attributes);
    window.history.replaceState(null, "", `?variant=${next.slug}`);
  }

  const available = (axis: string, value: string) =>
    p.variants.some((v) => v.attributes[axis] === value && sameValue({ ...picked, [axis]: value }, v.attributes));

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {!p.upcoming && <TrackEcommerce event="view_item" items={[{ item_id: p.id, item_name: p.name, price: p.priceFrom, ...(p.brand && { item_brand: p.brand.name }), ...(p.category && { item_category: p.category.name }) }]} />}
      <div className="flex w-full max-w-[500px] flex-col gap-3 lg:max-w-[642px] lg:flex-row">
        {gallery.length > 1 && (
          // Desktop: three thumbnails stacked beside the photo, matching its height, with arrows to scroll for more.
          // Phones: a sideways-scrolling row under the photo.
          <div className="order-2 lg:relative lg:order-1 lg:w-[130px] lg:shrink-0">
            <div className="flex min-w-0 gap-2 lg:absolute lg:inset-0 lg:flex-col">
              {gallery.length > 3 && (
                <button type="button" aria-label="Previous photos" onClick={() => scrollThumbs(-1)} className={arrowClass}>
                  <span aria-hidden="true">⌃</span>
                </button>
              )}
              <ul
                ref={strip}
                className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] lg:grid lg:min-h-0 lg:auto-rows-[calc((100%-1rem)/3)] lg:overflow-y-auto lg:overflow-x-hidden"
              >
                {gallery.map((img, i) => (
                  <li key={img.id} className="shrink-0 lg:min-h-0">
                    <button
                      type="button"
                      aria-label={`Show photo ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => setThumb({ variantId: variant?.id ?? null, index: i })}
                      className={`block h-16 w-16 overflow-hidden rounded-[var(--radius-btn)] border-2 transition lg:h-full lg:w-full ${
                        i === index ? "border-brand" : "border-line hover:border-brand/40"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- photos come from the API host */}
                      <img src={imageUrl(img.url)} alt="" className="h-full w-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
              {gallery.length > 3 && (
                <button type="button" aria-label="Next photos" onClick={() => scrollThumbs(1)} className={arrowClass}>
                  <span aria-hidden="true">⌄</span>
                </button>
              )}
            </div>
          </div>
        )}
        <div className="order-1 aspect-square min-w-0 flex-1 overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface lg:order-2">
          {main ? (
            // eslint-disable-next-line @next/next/no-img-element -- photos come from the API host, not a fixed domain
            <img src={imageUrl(main.url)} alt={main.altText ?? p.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-faint">No photo</div>
          )}
        </div>
      </div>

      <div>
        {p.category && (
          <Link
            href={`/shop?category=${p.category.slug}`}
            className="text-xs font-bold uppercase tracking-[0.08em] text-faint hover:text-accent-dark"
          >
            {p.category.name}
          </Link>
        )}
        <h1 className="mt-1 text-[1.5rem] font-bold leading-tight text-brand sm:text-[2rem]">{p.name}</h1>
        <div className="mt-2 h-1 w-16 rounded-full bg-accent" />
        {rating}

        {p.upcoming && (
          <span className="mt-4 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Upcoming
          </span>
        )}
        <p className="mt-4 text-3xl font-extrabold text-brand">
          {p.upcoming && price === 0 ? <span className="text-xl text-muted">Price to be announced</span> : <Price value={price} />}
        </p>
        {p.shortDescription && <p className="mt-4 text-muted">{p.shortDescription}</p>}

        {grouped &&
          p.axes.map((axis) => (
            <fieldset key={axis.name} className="mt-6">
              <legend className="text-sm font-semibold text-ink">
                {axis.name}: <span className="font-normal text-muted">{picked[axis.name]}</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {axis.values.map((value) => {
                  const selected = picked[axis.name] === value;
                  const reachable = available(axis.name, value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => choose(axis.name, value)}
                      className={`rounded-[var(--radius-btn)] border px-4 py-2 text-sm font-semibold transition ${
                        selected
                          ? "border-brand bg-brand text-white"
                          : reachable
                            ? "border-line bg-white text-brand hover:border-brand"
                            : "border-dashed border-line bg-white text-faint hover:border-brand/40"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

        {p.upcoming ? (
          <div className="mt-7">
            <Button size="lg" className="w-full sm:w-auto sm:min-w-56" disabled>
              Coming soon
            </Button>
            <p className="mt-2 text-xs text-muted">This product is not available to order yet. Check back soon.</p>
          </div>
        ) : (
        <div className="mt-7">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-ink">Quantity</span>
            <QtyStepper value={quantity} onChange={setQuantity} label="Quantity" />
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              icon="cart"
              className="sm:min-w-48"
              disabled={!orderable}
              onClick={() => {
                if (!orderable) return;
                addToCart({ productId: p.id, variantId: variant?.id ?? null, quantity });
                const item = trackItem(quantity);
                trackEcommerce("add_to_cart", currency, [item], { value: item.price * quantity });
                setAdded(true);
              }}
            >
              Add to cart
            </Button>
            <Button
              variant="accent"
              size="lg"
              className="sm:min-w-48"
              disabled={!orderable}
              onClick={() => setBuying(true)}
            >
              Buy now
            </Button>
          </div>
          {grouped && !variant && <p className="mt-2 text-xs text-muted">Choose every option to continue.</p>}
          {buying && orderable && (
            <BuyNowModal
              item={{ productId: p.id, variantId: variant?.id ?? null, quantity }}
              variantLabel={variant ? Object.values(variant.attributes).join(" / ") : null}
              defaults={defaults}
              onClose={() => setBuying(false)}
            />
          )}
          {added && (
            <p role="status" className="mt-3 text-sm font-semibold text-success">
              Added to your cart.{" "}
              <Link href="/cart" className="underline">
                View cart
              </Link>
            </p>
          )}
        </div>
        )}

        <dl className="mt-8 grid w-fit max-w-full grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 text-sm">
          {(variant?.sku ?? p.sku) && (
            <>
              <dt className="text-faint">SKU</dt>
              <dd className="font-mono text-ink">{variant?.sku ?? p.sku}</dd>
            </>
          )}
          {p.brand && (
            <>
              <dt className="text-faint">Brand</dt>
              <dd>
                <Link href={`/shop?brand=${p.brand.slug}`} className={chip}>
                  {p.brand.name}
                </Link>
              </dd>
            </>
          )}
          {p.category && (
            <>
              <dt className="text-faint">Categories</dt>
              <dd className="flex flex-wrap gap-1.5">
                {[p.category, ...p.secondaryCategories].map((c) => (
                  <Link key={c.slug} href={`/shop?category=${c.slug}`} className={chip}>
                    {c.name}
                  </Link>
                ))}
              </dd>
            </>
          )}
          {p.weight != null && (
            <>
              <dt className="text-faint">Weight</dt>
              <dd className="text-ink">{p.weight}</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}
