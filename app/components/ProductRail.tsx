import { fetchProducts } from "../lib/catalog";
import { toDefaults } from "../lib/address";
import { fetchAddresses } from "../lib/addresses";
import { getCurrentUser } from "../lib/session";
import { CardActions } from "../shop/_components/CardActions";
import { cardItem, ShopCard } from "../shop/_components/ShopCard";
import { TrackEcommerce } from "./Track";
import { Section } from "./Section";

/** The newest products in the catalog. */
export async function NewArrivals() {
  const [page, user, addresses] = await Promise.all([fetchProducts({ sort: "newest" }, 8), getCurrentUser(), fetchAddresses()]);
  const items = page?.items ?? [];
  if (items.length === 0) return null;
  const defaults = toDefaults(addresses[0], user?.name); // pre-fills the quick order form

  return (
    <Section id="new-arrivals" title="New Arrivals" subtitle="Fresh stock, just landed" cta="Shop New Arrivals" href="/shop?sort=newest">
      <TrackEcommerce event="view_item_list" items={items.map((p, i) => cardItem(p, i))} extra={{ item_list_name: "New arrivals" }} />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p, i) => (
          <li key={p.id}>
            <ShopCard p={p} list="New arrivals" index={i} actions={<CardActions p={p} defaults={defaults} />} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
