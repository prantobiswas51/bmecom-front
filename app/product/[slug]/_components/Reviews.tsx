import Link from "next/link";
import { Suspense } from "react";
import { Stars } from "../../../components/Stars";
import { api } from "../../../lib/api";
import type { ReviewPage } from "../../../lib/reviews";
import { getAccessToken, getCurrentUser } from "../../../lib/session";
import { ReviewForm } from "./ReviewForm";

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Small "4.5 (12 reviews)" line that jumps to the reviews. Shown under the product name. */
export function RatingLink({ summary }: { summary: ReviewPage["summary"] }) {
  return (
    <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-muted hover:text-brand">
      <Stars value={summary.average} />
      {summary.count > 0 ? (
        <span>
          <span className="font-semibold text-ink">{summary.average.toFixed(1)}</span> ({summary.count} review{summary.count === 1 ? "" : "s"})
        </span>
      ) : (
        <span>No reviews yet</span>
      )}
    </a>
  );
}

/** The write-a-review area: needs the visitor's session, so it renders at request time. */
async function WriteReview({ slug }: { slug: string }) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <p className="text-sm text-muted">
        <Link href="/auth/login" className="font-semibold text-accent-dark hover:underline">
          Sign in
        </Link>{" "}
        to write a review.
      </p>
    );
  }
  const mine = await api<{ review: { status: string } | null }>(`/catalog/products/${encodeURIComponent(slug)}/reviews/mine`, {
    method: "GET",
    token: await getAccessToken(),
  });
  if (mine.ok && mine.data.review) {
    return <p className="text-sm text-muted">You have already reviewed this product. Thank you!</p>;
  }
  return <ReviewForm slug={slug} />;
}

export function Reviews({
  slug,
  data,
  searchPath,
}: {
  slug: string;
  data: ReviewPage;
  /** Where the page links go for more reviews, e.g. `/product/abc?reviews=`. */
  searchPath: string;
}) {
  const { summary, items, page, totalPages } = data;

  return (
    <section id="reviews" className="mt-14 scroll-mt-40">
      <h2 className="text-[1.375rem] font-bold text-brand sm:text-2xl">Customer reviews</h2>
      <div className="mt-1.5 h-1 w-20 rounded-full bg-accent" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-[var(--radius-card)] border border-line bg-white p-5">
            {summary.count > 0 ? (
              <>
                <p className="flex items-end gap-3">
                  <span className="text-4xl font-extrabold text-brand">{summary.average.toFixed(1)}</span>
                  <span className="pb-1 text-sm text-muted">out of 5</span>
                </p>
                <Stars value={summary.average} className="mt-1 text-xl" />
                <p className="mt-1 text-sm text-muted">
                  Based on {summary.count} review{summary.count === 1 ? "" : "s"}
                </p>
                <ul className="mt-4 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const n = summary.breakdown[star - 1];
                    return (
                      <li key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-8 text-muted">{star} ★</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                          <span className="block h-full rounded-full bg-accent" style={{ width: `${(n / summary.count) * 100}%` }} />
                        </span>
                        <span className="w-7 text-right text-muted">{n}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted">No reviews yet. Be the first to share what you think.</p>
            )}
          </div>

          <div className="rounded-[var(--radius-card)] border border-line bg-white p-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-faint">Write a review</h3>
            <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
              <WriteReview slug={slug} />
            </Suspense>
          </div>
        </div>

        <div>
          {items.length > 0 && (
            <ul className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
              {items.map((r) => (
                <li key={r.id} className="p-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Stars value={r.rating} />
                    {r.title && <p className="font-semibold text-brand">{r.title}</p>}
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {r.authorName} · {date(r.createdAt)}
                    {r.verifiedPurchase && <span className="ml-2 font-semibold text-success">✓ Verified purchase</span>}
                  </p>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink">{r.body}</p>
                </li>
              ))}
            </ul>
          )}
          {totalPages > 1 && (
            <nav aria-label="Review pages" className="mt-4 flex items-center justify-between text-sm font-semibold">
              {page > 1 ? (
                <Link href={`${searchPath}${page - 1}#reviews`} scroll={false} className="text-accent-dark hover:underline">
                  ← Newer
                </Link>
              ) : (
                <span />
              )}
              <span className="text-muted">
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <Link href={`${searchPath}${page + 1}#reviews`} scroll={false} className="text-accent-dark hover:underline">
                  Older →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
