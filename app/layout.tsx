import type { Metadata } from "next";
import { Analytics } from "./components/Analytics";
import { CurrencyProvider } from "./components/Price";
import { getSettings } from "./lib/settings";
import { themeCss } from "./lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "BongoMaker",
  description:
    "Art supplies, stationery and craft materials, delivered fast across Bangladesh.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { theme, currency } = await getSettings();
  const css = themeCss(theme);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <head>
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}</head>
      <body className="min-h-full flex flex-col">
        <Analytics />
        <CurrencyProvider currency={currency}>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
