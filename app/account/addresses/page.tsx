import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { fetchAddresses } from "../../lib/addresses";
import { getCurrentUser } from "../../lib/session";
import { AddressBook } from "../_components/AddressBook";

export const metadata: Metadata = { title: "My addresses | BongoMaker Store" };

async function Addresses() {
  if (!(await getCurrentUser())) redirect("/auth/login?next=/account/addresses");
  const addresses = await fetchAddresses();

  return (
    <div>
      <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">My addresses</h1>
      <div className="mt-1.5 h-1 w-20 rounded-full bg-accent" />
      <p className="mt-3 text-sm text-muted">Save the places you order to. Your default address is filled in at checkout.</p>
      <div className="mt-6">
        <AddressBook addresses={addresses} />
      </div>
    </div>
  );
}

export default function AddressesPage() {
  return (
    <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
      <Addresses />
    </Suspense>
  );
}
