import { cache } from "react";
import { API_URL } from "./api-url";

export type BlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: string | null;
};

export type BlogPage = { items: BlogCard[]; page: number; totalPages: number };

export type BlogPostDetail = BlogCard & { content: string; updatedAt: string };

/** One page of published posts; null when the API can't be reached. */
export async function fetchBlogPosts(page = 1): Promise<BlogPage | null> {
  try {
    const res = await fetch(`${API_URL}/catalog/blog?page=${page}`, { cache: "no-store" });
    return res.ok ? ((await res.json()) as BlogPage) : null;
  } catch {
    return null;
  }
}

/** A published post, "missing" when there is none with that address, null when the API is unreachable. */
export const fetchBlogPost = cache(async (slug: string): Promise<BlogPostDetail | "missing" | null> => {
  try {
    const res = await fetch(`${API_URL}/catalog/blog/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (res.status === 404) return "missing";
    return res.ok ? ((await res.json()) as BlogPostDetail) : null;
  } catch {
    return null;
  }
});

export const blogDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
