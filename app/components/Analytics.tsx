"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect } from "react";
import { GTM_ID, track } from "../lib/gtm";

/** Query parameters that grant access to something and must never be sent to a third party. */
const SECRET_PARAMS = ["key", "token"];

/** Sends a page_view on every page and every client-side navigation. */
function PageViews() {
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

/** Loads the Google Tag Manager container named in NEXT_PUBLIC_GTM_ID. Renders nothing when there is none. */
export function Analytics() {
  if (!GTM_ID) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=document.getElementsByTagName('script')[0],j=document.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';f.parentNode.insertBefore(j,f);`}
      </Script>
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
      </noscript>
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}
