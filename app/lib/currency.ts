export type Currency = { code: string; symbol: string; position: "before" | "after"; decimals: 0 | 2 };

export const DEFAULT_CURRENCY: Currency = { code: "BDT", symbol: "৳", position: "before", decimals: 0 };

export function formatMoney(n: number, c: Currency) {
  const digits = n.toLocaleString("en-US", { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals });
  return c.position === "before" ? `${c.symbol}${digits}` : `${digits} ${c.symbol}`;
}
