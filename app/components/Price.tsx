"use client";

import { createContext, useContext } from "react";
import { DEFAULT_CURRENCY, formatMoney, type Currency } from "../lib/currency";

const CurrencyContext = createContext<Currency>(DEFAULT_CURRENCY);

/** Makes the store's currency available to every <Price>. Mounted once in the root layout. */
export function CurrencyProvider({ currency, children }: { currency: Currency; children: React.ReactNode }) {
  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

/** The store's currency code, e.g. BDT, for analytics events. */
export const useCurrencyCode = () => useContext(CurrencyContext).code;

/** An amount in the store's currency, written the way the admin chose in Settings. */
export function Price({ value }: { value: number }) {
  return <>{formatMoney(value, useContext(CurrencyContext))}</>;
}
