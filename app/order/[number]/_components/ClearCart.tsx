"use client";

import { useEffect } from "react";
import { clearCart } from "../../../lib/cart";

/** Empties the cart once an order made from it has been placed. */
export function ClearCart() {
  useEffect(() => clearCart(), []);
  return null;
}
