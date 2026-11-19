"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Price } from "../../components/Price";

/**
 * "Max price" slider. Dragging shows the amount straight away; the shop reloads when the handle is
 * let go. Sitting at the top end means no limit, so the filter is dropped from the address.
 */
export function PriceFilter({ max, value, baseHref }: { max: number; value: number | undefined; baseHref: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState(Math.min(value ?? max, max));

  function commit() {
    const sep = baseHref.includes("?") ? "&" : "?";
    router.push(amount >= max ? baseHref : `${baseHref}${sep}maxPrice=${amount}`);
  }

  // Round steps keep the slider usable for both a 50 and a 50,000 range.
  const step = max > 5000 ? 100 : max > 500 ? 10 : 1;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.06em] text-ink">Max price</h2>
        <span className="text-sm font-bold text-brand">
          <Price value={amount} />
        </span>
      </div>
      <input
        type="range"
        aria-label="Maximum price"
        min={0}
        max={max}
        step={step}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        onPointerUp={commit}
        onKeyUp={commit}
        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-brand)]"
      />
    </div>
  );
}
