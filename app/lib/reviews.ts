import { API_URL } from "./api";

export type ReviewSummary = { count: number; average: number; /** index 0 is one star */ breakdown: number[] };

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

export type ReviewPage = { summary: ReviewSummary; items: Review[]; page: number; totalPages: number };

/** Reviews for a product; null when the API can't be reached. */
export async function fetchReviews(slug: string, page = 1): Promise<ReviewPage | null> {
  try {
    const res = await fetch(`${API_URL}/catalog/products/${encodeURIComponent(slug)}/reviews?page=${page}`, { cache: "no-store" });
    return res.ok ? ((await res.json()) as ReviewPage) : null;
  } catch {
    return null;
  }
}

export type LatestReview = Omit<Review, "createdAt"> & { product: { name: string; slug: string } };

/** A few recent good reviews for the home page; empty when there are none or the API can't be reached. */
export async function fetchLatestReviews(): Promise<LatestReview[]> {
  try {
    const res = await fetch(`${API_URL}/catalog/reviews/latest`, { cache: "no-store" });
    return res.ok ? ((await res.json()) as LatestReview[]) : [];
  } catch {
    return [];
  }
}
