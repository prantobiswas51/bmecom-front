"use client";

import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { useCurrencyCode } from "../../components/Price";
import { BuyNowModal } from "../../product/[slug]/_components/BuyNowModal";
import type { Defaults } from "../../lib/address";
import { addToCart } from "../../lib/cart";
import type { CatalogCard } from "../../lib/catalog";
import { trackEcommerce } from "../../lib/gtm";
import { cardItem } from "./ShopCard";

/**
 * Add to cart and Buy now under a product tile, one above the other. A product with options needs
 * a choice first, so it links to its page instead. Upcoming products have nothing to order yet.
 */
export function CardActions({ p, defaults }: { p: CatalogCard; defaults?: Defaults }) {
  const currency = useCurrencyCode();
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  if (p.upcoming) return null;

  if (!p.inStock) {
    return (
      <div className="mt-3">
        <Button size="sm" variant="outline" className="w-full" disabled>
          Sold out
        </Button>
      </div>
    );
  }

  if (p.grouped) {
    return (
      <div className="mt-3">
        <Button href={`/product/${p.slug}`} size="sm" variant="outline" className="w-full">
          Choose options
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <Button
        size="sm"
        variant="outline"
        icon="cart"
        className="w-full"
        onClick={() => {
          addToCart({ productId: p.id, variantId: null, quantity: 1 });
          const item = { ...cardItem(p), quantity: 1 };
          trackEcommerce("add_to_cart", currency, [item], { value: item.price });
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        }}
      >
        {added ? "Added ✓" : "Add to cart"}
      </Button>
      <Button size="sm" variant="accent" className="w-full" onClick={() => setBuying(true)}>
        Buy now
      </Button>
      {buying && <BuyNowModal item={{ productId: p.id, variantId: null, quantity: 1 }} defaults={defaults} onClose={() => setBuying(false)} />}
    </div>
  );
}
