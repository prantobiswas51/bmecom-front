"use client";

import Link from "next/link";
import { useCart } from "../lib/cart";
import { Icon } from "./icons";

/** The header's cart button, with the number of items in it. */
export function CartLink() {
  const count = useCart().reduce((sum, i) => sum + i.quantity, 0);
  return (
    <Link
      href="/cart"
      aria-label={count === 0 ? "Cart" : `Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative rounded-full p-2.5 text-brand hover:bg-soft"
    >
      <Icon name="cart" />
      {count > 0 && (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
