import Link from "next/link";
import { fetchLatestReviews } from "../lib/reviews";
import { Section } from "./Section";
import { Stars } from "./Stars";

/** A few recent good reviews, written by customers on the product pages. */
export async function Reviews() {
  const reviews = await fetchLatestReviews();
  if (reviews.length === 0) return null;

  return (
    <Section title="Loved by artists" subtitle="What customers say about their purchases">
      <ul className="grid gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.id} className="flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-6">
            <Stars value={r.rating} className="text-base" />
            {r.title && <p className="mt-3 font-bold text-brand">{r.title}</p>}
            <blockquote className="mt-2 line-clamp-5 flex-1 text-ink">&ldquo;{r.body}&rdquo;</blockquote>
            <p className="mt-4 text-sm font-bold text-brand">
              {r.authorName}
              {r.verifiedPurchase && <span className="ml-2 text-xs font-semibold text-success">✓ Verified purchase</span>}
            </p>
            <Link href={`/product/${r.product.slug}`} className="mt-0.5 text-xs text-muted hover:text-accent-dark hover:underline">
              on {r.product.name}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
