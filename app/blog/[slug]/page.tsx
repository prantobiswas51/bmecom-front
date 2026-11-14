import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { blogDate, fetchBlogPost } from "../../lib/blog";
import { fetchProducts, imageUrl } from "../../lib/catalog";
import { SideProduct } from "../_components/SideProduct";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug); // shared with the page body within this request
  if (!post || post === "missing") return { title: "Blog | BongoMaker Store" };
  return {
    title: `${post.title} | BongoMaker Blog`,
    description: post.excerpt || undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt || undefined,
      images: post.coverImage ? [imageUrl(post.coverImage)] : undefined,
    },
  };
}

async function Post({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (post === "missing") notFound();
  if (!post) {
    return (
      <p className="rounded-[var(--radius-card)] border border-line bg-white p-8 text-center text-muted">
        This post could not be loaded right now. Please try again in a moment.
      </p>
    );
  }

  return (
    // 70% for the post, 30% for products; stacked on small screens.
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
    <article className="min-w-0">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="hover:text-brand">
          Blog
        </Link>
      </nav>

      <h1 className="text-[1.75rem] font-bold leading-tight text-brand sm:text-4xl">{post.title}</h1>
      {post.publishedAt && (
        <time dateTime={post.publishedAt} className="mt-3 block text-sm text-muted">
          {blogDate(post.publishedAt)}
        </time>
      )}
      <div className="mt-3 h-1 w-20 rounded-full bg-accent" />

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element -- photos come from the API host, not a fixed domain
        <img src={imageUrl(post.coverImage)} alt="" className="mt-8 w-full rounded-[var(--radius-card)] object-cover" />
      )}

      {/* The backend strips the HTML down to a safe set of tags when the post is saved. */}
      <div className="blog-content mt-8 leading-relaxed text-ink" dangerouslySetInnerHTML={{ __html: post.content }} />

      <p className="mt-12">
        <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
          ← Back to the blog
        </Link>
      </p>
    </article>

    <aside aria-label="Products" className="lg:sticky lg:top-40">
      <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-brand">Recent products</h2>
      <div className="mt-1.5 h-1 w-16 rounded-full bg-accent" />
      <Suspense fallback={<div className="mt-6 h-96" aria-hidden="true" />}>
        <SideProducts />
      </Suspense>
    </aside>
    </div>
  );
}

/** The newest products, beside the post. Nothing is shown if the shop can't be reached. */
async function SideProducts() {
  const result = await fetchProducts({ sort: "newest" }, 5);
  const items = result?.items ?? [];
  if (items.length === 0) return null;
  return (
    <>
      <ul className="mt-6 space-y-5">
        {items.map((p, i) => (
          <li key={p.id}>
            <SideProduct p={p} index={i} />
          </li>
        ))}
      </ul>
      <Link href="/shop" className="mt-6 inline-block text-sm font-semibold text-brand hover:underline">
        See all products →
      </Link>
    </>
  );
}

export default function BlogPostPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
      <Post params={params} />
    </Suspense>
  );
}
