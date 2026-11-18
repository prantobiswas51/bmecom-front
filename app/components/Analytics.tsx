import { connection } from "next/server";
import Script from "next/script";
import { Suspense } from "react";
import { parseGtmId } from "../lib/gtm";
import { PageViews } from "./PageViews";

/**
 * Loads the Google Tag Manager container named by GTM_ID in the server's environment. It is read for
 * each request, not at build time, so the id lives only on the server and can be changed with a restart.
 */
async function Gtm() {
  await connection(); // read the environment per request instead of freezing it into the build
  const id = parseGtmId(process.env.GTM_ID);
  return (
    <>
      {/* Tells the browser code whether tracking is on ("" means off). */}
      <script dangerouslySetInnerHTML={{ __html: `window.__GTM_ID=${JSON.stringify(id)};` }} />
      {id && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=document.getElementsByTagName('script')[0],j=document.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=${id}';f.parentNode.insertBefore(j,f);`}
          </Script>
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${id}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
          <PageViews />
        </>
      )}
    </>
  );
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <Gtm />
    </Suspense>
  );
}
