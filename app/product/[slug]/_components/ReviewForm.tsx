"use client";

import { useActionState, useState } from "react";
import { Alert } from "../../../components/ui/Alert";
import { Button } from "../../../components/ui/Button";
import { Field } from "../../../components/ui/Field";
import { submitReviewAction, type ReviewState } from "../actions";

const initial: ReviewState = {};

export function ReviewForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(submitReviewAction.bind(null, slug), initial);
  const [rating, setRating] = useState(Number(state.values?.rating) || 0);
  const v = state.values;

  if (state.done) return <Alert tone="success">Thank you! Your review has been posted.</Alert>;

  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <fieldset>
        <legend className="mb-1.5 text-sm font-semibold text-brand">Your rating *</legend>
        <input type="hidden" name="rating" value={rating || ""} />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              className={`text-3xl leading-none transition ${n <= rating ? "text-accent" : "text-line hover:text-accent/50"}`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Title (optional)" name="title" maxLength={120} placeholder="Sum it up in a few words" defaultValue={v?.title} />

      <div>
        <label htmlFor="review-body" className="mb-1.5 block text-sm font-semibold text-brand">
          Your review *
        </label>
        <textarea
          id="review-body"
          name="body"
          required
          minLength={3}
          maxLength={2000}
          rows={4}
          defaultValue={v?.body}
          placeholder="What did you like or dislike? How did you use it?"
          className="w-full rounded-[var(--radius-btn)] border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Posting..." : "Post review"}
      </Button>
    </form>
  );
}
