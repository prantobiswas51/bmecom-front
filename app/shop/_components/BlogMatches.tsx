import Link from "next/link";
import type { BlogCard } from "../../lib/blog";
import { blogDate } from "../../lib/blog";
import { imageUrl } from "../../lib/catalog";

/** Blog posts that match a search, shown under the product results. */
export function BlogMatches({ posts, term }: { posts: BlogCard[]; term: string }) {
  if (posts.length === 0) return null;
  return (
    <section className="mt-12" aria-labelledby="blog-matches">
      <h2 id="blog-matches" className="text-[1.25rem] font-bold text-brand sm:text-2xl">
        From the blog
      </h2>
      <div className="mt-1.5 h-1 w-20 rounded-full bg-accent" />
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((p) => (
          <li key={p.id}>
            <Link
              href={`/blog/${p.slug}`}
              className="group flex h-full gap-4 rounded-[var(--radius-card)] border border-line bg-white p-3 transition hover:border-accent"
            >
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-[var(--radius-btn)] bg-brand-soft">
                {p.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element -- photos come from the API host, not a fixed domain
                  <img src={imageUrl(p.coverImage)} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
              <div className="min-w-0">
                {p.publishedAt && <p className="text-xs font-semibold uppercase tracking-wide text-faint">{blogDate(p.publishedAt)}</p>}
                <h3 className="line-clamp-2 font-bold text-brand group-hover:text-accent-dark">{p.title}</h3>
                {p.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted">{p.excerpt}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href={`/blog?q=${encodeURIComponent(term)}`} className="font-semibold text-accent-dark hover:underline">
          See all posts matching “{term}” →
        </Link>
      </p>
    </section>
  );
}
