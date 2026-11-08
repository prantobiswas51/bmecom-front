"use client";

import { useState } from "react";
import { Icon } from "./icons";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative bg-brand px-10 py-2 text-center text-sm text-white">
      <b className="text-accent">Cash on delivery</b> across Bangladesh. No account needed to order.{" "}
      <a href="/shop" className="ml-1 font-semibold underline-offset-2 hover:underline">
        Shop now →
      </a>
      <button
        onClick={() => setOpen(false)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/10"
      >
        <Icon name="close" width={16} height={16} />
      </button>
    </div>
  );
}
