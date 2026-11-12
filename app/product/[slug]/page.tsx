import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchProduct, fetchProducts, imageUrl } from "../../lib/catalog";
import { fetchReviews } from "../../lib/reviews";
import { toDefaults } from "../../lib/address";
import { fetchAddresses } from "../../lib/addresses";
import { getCurrentUser } from "../../lib/session";
import { ShopCard } from "../../shop/_components/ShopCard";
import { ProductView } from "./_components/ProductView";
import { RatingLink, Reviews } from "./_components/Reviews";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug); // shared with the page body within this request
  if (!product || product === "missing") return { title: "Product | BongoMaker Store" };

  const photo = product.images.find((i) => !i.variantId) ?? product.images[0];
  return {
    title: product.seoTitle || `${product.name} | BongoMaker Store`,
    description: product.metaDescription || product.shortDescription || undefined,
    keywords: product.metaKeywords || undefined,
    openGraph: photo ? { images: [imageUrl(photo.url)] } : undefined,
  };
}

async function Related({ categorySlug, exceptId }: { categorySlug: string; exceptId: string }) {
  const result = await fetchProducts({ category: categorySlug }, 5);
  const items = result?.items.filter((p) => p.id !== exceptId).slice(0, 4) ?? [];
  if (items.length === 0) return null;
  return (
    <section className="mt-14">
      <h2 className="text-[1.375rem] font-bold text-brand sm:text-2xl">You may also like</h2>
      <div className="mt-1.5 h-1 w-20 rounded-full bg-accent" />
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {items.map((p, i) => (
          <li key={p.id}>
            <ShopCard p={p} list="Related products" index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

async function Product({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { slug } = await params;
  const { variant, reviews: reviewsPage } = await searchParams;
  const [user, addresses] = await Promise.all([getCurrentUser(), fetchAddresses()]);
  const defaults = toDefaults(addresses[0], user?.name);
  const [product, reviews] = await Promise.all([fetchProduct(slug), fetchReviews(slug, Math.max(1, Number(Array.isArray(reviewsPage) ? reviewsPage[0] : reviewsPage) || 1))]);

  if (product === "missing") notFound();
  if (!product) {
    return (
      <p className="rounded-[var(--radius-card)] border border-line bg-white p-8 text-center text-muted">
        This product could not be loaded right now. Please try again in a moment.
      </p>
    );
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/shop" className="hover:text-brand">
          Shop
        </Link>
        {product.category && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand">
              {product.category.name}
            </Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-ink" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* Re-mounts per product so one product's variant choice never leaks into the next. */}
      <ProductView key={product.id} product={product} initialVariant={Array.isArray(variant) ? variant[0] : variant}
        rating={reviews && <RatingLink summary={reviews.summary} />}
        defaults={defaults}
      />

      {product.description && (
        <section className="mt-14 max-w-3xl">
          <h2 className="text-[1.375rem] font-bold text-brand sm:text-2xl">Description</h2>
          <div className="mt-1.5 h-1 w-20 rounded-full bg-accent" />
          {/* The backend strips the HTML down to a safe set of tags when the product is saved. */}
          <div
            className={`product-description mt-5 leading-relaxed text-ink ${/<\/?[a-z][\s\S]*>/i.test(product.description) ? "" : "whitespace-pre-line"}`}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      {reviews && <Reviews slug={product.slug} data={reviews} searchPath={`/product/${product.slug}?reviews=`} />}

      {product.category && (
        <Suspense fallback={null}>
          <Related categorySlug={product.category.slug} exceptId={product.id} />
        </Suspense>
      )}
    </>
  );
}

export default function ProductPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
      <Product params={params} searchParams={searchParams} />
    </Suspense>
  );
}
