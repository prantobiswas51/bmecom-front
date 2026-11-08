import type { Metadata } from "next";
import { CartView } from "./_components/CartView";

export const metadata: Metadata = { title: "Your cart | BongoMaker Store" };

export default function CartPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">Your cart</h1>
        <div className="mt-1.5 h-1 w-24 rounded-full bg-accent" />
      </div>
      <CartView />
    </>
  );
}
