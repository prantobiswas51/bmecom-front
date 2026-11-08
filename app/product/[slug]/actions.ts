"use server";

import { revalidatePath } from "next/cache";
import { api } from "../../lib/api";
import { getAccessToken } from "../../lib/session";

export type ReviewState = { error?: string; done?: boolean; values?: { rating: string; title: string; body: string } };

const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

export async function submitReviewAction(slug: string, _prev: ReviewState, data: FormData): Promise<ReviewState> {
  const values = { rating: text(data, "rating"), title: text(data, "title"), body: text(data, "body") };
  const rating = Number(values.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Please choose a star rating.", values };
  if (values.body.length < 3) return { error: "Please write a few words about the product.", values };

  const token = await getAccessToken();
  if (!token) return { error: "Please sign in to write a review.", values };

  const res = await api(`/catalog/products/${encodeURIComponent(slug)}/reviews`, {
    token,
    body: { rating, body: values.body, ...(values.title && { title: values.title }) },
  });
  if (!res.ok) return { error: res.message, values };

  revalidatePath(`/product/${slug}`);
  return { done: true };
}
