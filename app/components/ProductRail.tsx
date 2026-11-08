import { fetchProducts } from "../lib/catalog";
import { cardItem, ShopCard } from "../shop/_components/ShopCard";
import { TrackEcommerce } from "./Track";
import { Section } from "./Section";

/** The newest products in the catalog. */
export async function NewArrivals() {
  const page = await fetchProducts({ sort: "newest" }, 8);
  const items = page?.items ?? [];
  if (items.length === 0) return null;

  return (
    <Section id="new-arrivals" title="New Arrivals" subtitle="Fresh stock, just landed" cta="Shop New Arrivals" href="/shop?sort=newest">
      <TrackEcommerce event="view_item_list" items={items.map((p, i) => cardItem(p, i))} extra={{ item_list_name: "New arrivals" }} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p, i) => (
          <li key={p.id}>
            <ShopCard p={p} list="New arrivals" index={i} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
