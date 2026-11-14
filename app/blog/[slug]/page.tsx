import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { blogDate, fetchBlogPost } from "../../lib/blog";
import { imageUrl } from "../../lib/catalog";

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
    <article className="mx-auto max-w-3xl">
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
  );
}

export default function BlogPostPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
      <Post params={params} />
    </Suspense>
  );
}
