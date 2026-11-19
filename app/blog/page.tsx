import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { blogDate, fetchBlogPosts } from "../lib/blog";
import { imageUrl } from "../lib/catalog";

export const metadata: Metadata = {
  title: "Blog | BongoMaker Store",
  description: "Ideas, guides and news about DIY electronics, microcontrollers, 3D printing, SMPS and lights.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function Posts({ searchParams }: { searchParams: SearchParams }) {
  const { page: pageParam, q: qParam } = await searchParams;
  const raw = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const page = Math.max(1, Number(raw) || 1);
  const q = (Array.isArray(qParam) ? qParam[0] : qParam)?.trim() || undefined;
  const data = await fetchBlogPosts(page, q);
  // Pagination links keep the search.
  const href = (p: number) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  if (!data) {
    return (
      <p className="rounded-[var(--radius-card)] border border-line bg-white p-8 text-center text-muted">
        The blog could not be loaded right now. Please try again in a moment.
      </p>
    );
  }
  if (data.items.length === 0) {
    return (
      <p className="rounded-[var(--radius-card)] border border-line bg-white p-8 text-center text-muted">
        {q ? `No posts match "${q}".` : "No posts yet. Please check back soon."}
      </p>
    );
  }

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((p) => (
          <li key={p.id}>
            <Link
              href={`/blog/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition hover:border-accent"
            >
              <div className="aspect-[16/9] bg-brand-soft">
                {p.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element -- photos come from the API host, not a fixed domain
                  <img src={imageUrl(p.coverImage)} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                {p.publishedAt && <time dateTime={p.publishedAt} className="text-xs font-semibold uppercase tracking-wide text-faint">{blogDate(p.publishedAt)}</time>}
                <h2 className="mt-1.5 text-lg font-bold text-brand group-hover:text-accent-dark">{p.title}</h2>
                {p.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted">{p.excerpt}</p>}
                <span className="mt-auto pt-4 text-sm font-semibold text-brand">Read more →</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {data.totalPages > 1 && (
        <nav aria-label="Pages" className="mt-10 flex items-center justify-center gap-4 text-sm">
          {data.page > 1 ? (
            <Link href={href(data.page - 1)} className="font-semibold text-brand hover:underline">
              ← Newer
            </Link>
          ) : (
            <span className="text-faint">← Newer</span>
          )}
          <span className="text-muted">
            Page {data.page} of {data.totalPages}
          </span>
          {data.page < data.totalPages ? (
            <Link href={href(data.page + 1)} className="font-semibold text-brand hover:underline">
              Older →
            </Link>
          ) : (
            <span className="text-faint">Older →</span>
          )}
        </nav>
      )}
    </>
  );
}

async function Heading({ searchParams }: { searchParams: SearchParams }) {
  const { q } = await searchParams;
  const term = (Array.isArray(q) ? q[0] : q)?.trim();
  return <h1 className="text-[1.75rem] font-bold text-brand sm:text-3xl">{term ? `Blog results for "${term}"` : "Blog"}</h1>;
}

export default function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <Suspense fallback={<h1 className="text-[1.75rem] font-bold text-brand sm:text-3xl">Blog</h1>}>
        <Heading searchParams={searchParams} />
      </Suspense>
      <div className="mt-1.5 mb-8 h-1 w-20 rounded-full bg-accent" />
      <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
        <Posts searchParams={searchParams} />
      </Suspense>
    </>
  );
}
