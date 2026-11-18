"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { track } from "../lib/gtm";

/** Query parameters that grant access to something and must never be sent to a third party. */
const SECRET_PARAMS = ["key", "token"];

/** Sends a page_view on every page and every client-side navigation. */
export function PageViews() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    // The page title is set a moment after the route changes, so wait for it.
    const timer = setTimeout(() => {
      // Order links carry the order's access key and email links carry one-time tokens: keep them out of analytics.
      const url = new URL(window.location.href);
      for (const secret of SECRET_PARAMS) url.searchParams.delete(secret);
      track("page_view", {
        page_path: url.pathname,
        page_location: url.href,
        page_title: document.title,
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [pathname, search]);

  return null;
}
