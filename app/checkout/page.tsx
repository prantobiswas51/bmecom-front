import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { fetchAddresses } from "../lib/addresses";
import { getCurrentUser } from "../lib/session";
import { CheckoutView } from "./_components/CheckoutView";

export const metadata: Metadata = { title: "Checkout | BongoMaker Store" };

/** Signed-in shoppers get their saved details filled in; everyone else can check out as a guest. */
async function Checkout() {
  const [user, addresses] = await Promise.all([getCurrentUser(), fetchAddresses()]);
  return (
    <>
      {!user && (
        <p className="mb-6 rounded-[var(--radius-btn)] border border-line bg-soft px-4 py-3 text-sm text-muted">
          You are checking out as a guest, no account needed.{" "}
          <Link href="/auth/login?next=/checkout" className="font-semibold text-accent-dark hover:underline">
            Sign in
          </Link>{" "}
          to use your saved details and track your orders.
        </p>
      )}
      {/* CheckoutView reads the URL for "Buy now" links, so it renders at request time. */}
      <CheckoutView addresses={addresses} accountName={user?.name} />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">Checkout</h1>
        <div className="mt-1.5 h-1 w-24 rounded-full bg-accent" />
      </div>
      <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
        <Checkout />
      </Suspense>
    </>
  );
}
