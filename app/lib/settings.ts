import { cacheLife } from "next/cache";
import { API_URL } from "./api";
import { DEFAULT_CURRENCY, type Currency } from "./currency";

export type Theme = {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryDark: string;
  tertiary: string;
  accent: string;
  other: string;
};


export type SiteSettings = { theme: Theme | null; currency: Currency };


/**
 * The colours and currency the admin chose. Cached, so it is part of every page's static shell and
 * changes show up within a minute. If the API is down the built-in look (globals.css) is used.
 */
export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 3600 });
  try {
    const res = await fetch(`${API_URL}/settings`);
    if (!res.ok) return { theme: null, currency: DEFAULT_CURRENCY };
    const data = (await res.json()) as { theme: Theme; currency: Currency };
    return { theme: data.theme, currency: data.currency };
  } catch {
    return { theme: null, currency: DEFAULT_CURRENCY };
  }
}
