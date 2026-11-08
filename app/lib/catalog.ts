// Public product catalog from the NestJS backend. Server-side only.
import { cache } from "react";
import { API_URL } from "./api";

export type CatalogCard = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  image: string | null;
  imageAlt: string | null;
  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
  /** Has variants, so the price is a "from" price. */
  grouped: boolean;
  /** Shown but not orderable yet. */
  upcoming: boolean;
  priceFrom: number;
  priceTo: number;
};

export type CatalogPage = {
  items: CatalogCard[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

/** parentSlug is set on sub categories; a category's count includes its sub categories' products. */
export type FilterOption = { name: string; slug: string; count: number; parentSlug?: string | null };
export type CatalogFilters = { categories: FilterOption[]; brands: FilterOption[] };

export const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name" },
] as const;

export type CatalogQuery = {
  q?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: string;
};

/** Uploaded photos are served by the API; the browser needs a public address for them. */
const PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3034").replace(/\/$/, "");
export const imageUrl = (url: string) => (/^https?:\/\//.test(url) ? url : `${PUBLIC_API_URL}${url}`);

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null; // API down: the page shows a friendly message instead of crashing
  }
}

export function fetchProducts(query: CatalogQuery, limit = 12) {
  const params = new URLSearchParams({ limit: String(limit) });
  for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
  return get<CatalogPage>(`/catalog/products?${params}`);
}

export const fetchNavCategories = () => get<Ref[]>("/catalog/nav-categories");

export const fetchFilters = () => get<CatalogFilters>("/catalog/filters");

export type Ref = { name: string; slug: string };

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  sku: string | null;
  weight: number | null;
  /** Shown but not orderable yet. */
  upcoming: boolean;
  brand: Ref | null;
  category: Ref | null;
  secondaryCategories: Ref[];
  axes: { name: string; values: string[] }[];
  variants: { id: string; slug: string; sku: string | null; attributes: Record<string, string>; price: number }[];
  images: { id: string; url: string; altText: string | null; variantId: string | null }[];
  priceFrom: number;
  priceTo: number;
  seoTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
};

/** "missing" is a real 404 (unknown or not live); null means the API could not be reached. Deduped per request. */
export const fetchProduct = cache(async (slug: string): Promise<ProductDetail | "missing" | null> => {
  try {
    const res = await fetch(`${API_URL}/catalog/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (res.status === 404) return "missing";
    return res.ok ? ((await res.json()) as ProductDetail) : null;
  } catch {
    return null;
  }
});
