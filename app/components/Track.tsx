"use client";

import Link from "next/link";
import { useEffect, useRef, type ComponentProps } from "react";
import { sumValue, track, trackEcommerce, type GtmItem } from "../lib/gtm";
import { useCurrencyCode } from "./Price";

/**
 * Sends an e-commerce event once when it appears (and again if its items change).
 * `once` names something that must never be counted twice, like an order: reloading the page skips it.
 */
export function TrackEcommerce({
  event,
  items,
  extra,
  once,
}: {
  event: string;
  items: GtmItem[];
  extra?: Record<string, unknown>;
  once?: string;
}) {
  const currency = useCurrencyCode();
  const signature = JSON.stringify([event, items, extra]);
  const sent = useRef("");

  useEffect(() => {
    if (sent.current === signature) return; // React's dev double-run
    sent.current = signature;
    if (once) {
      try {
        if (sessionStorage.getItem(`gtm_${once}`)) return;
        sessionStorage.setItem(`gtm_${once}`, "1");
      } catch {
        // storage blocked: better to send twice than never
      }
    }
    trackEcommerce(event, currency, items, { value: sumValue(items), ...extra });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `signature` stands for event, items and extra
  }, [signature, currency, once]);

  return null;
}

/** A shop search: the words used and how many products matched. */
export function TrackSearch({ term, results }: { term: string; results: number }) {
  useEffect(() => {
    track("search", { search_term: term, search_results: results });
  }, [term, results]);
  return null;
}

/** A plain event, sent once when it appears. */
export function TrackEvent({ event, params }: { event: string; params?: Record<string, unknown> }) {
  const signature = JSON.stringify([event, params]);
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `signature` stands for event and params
  }, [signature]);
  return null;
}

/** A link to a product that reports select_item when clicked. */
export function ProductLink({ item, list, ...props }: { item: GtmItem; list: string } & ComponentProps<typeof Link>) {
  const currency = useCurrencyCode();
  return (
    <Link
      {...props}
      onClick={() =>
        trackEcommerce("select_item", currency, [item], { item_list_name: list, item_list_id: list.toLowerCase().replace(/\s+/g, "-") })
      }
    />
  );
}
