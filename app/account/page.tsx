import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Alert } from "../components/ui/Alert";
import { fetchAddresses } from "../lib/addresses";
import { fetchMyOrders, STATUS } from "../lib/orders";
import { getCurrentUser } from "../lib/session";
import { ResendVerification } from "./_components/actions";
import { OrderRow } from "./_components/OrderRow";
import { TrackEvent } from "../components/Track";

export const metadata: Metadata = { title: "My account | BongoMaker Store" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const panel = "rounded-[var(--radius-card)] border border-line bg-white";

async function Overview({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/account");
  const { welcome } = await searchParams;
  const [orders, addresses] = await Promise.all([fetchMyOrders(), fetchAddresses()]);
  const latest = orders?.items[0];
  const firstName = user.name?.split(" ")[0];

  return (
    <div className="space-y-6">
      {welcome && <Alert tone="success">Welcome aboard! Your account is ready.</Alert>}
      {welcome && <TrackEvent event="sign_up" params={{ method: "email" }} />}

      <div>
        <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">Hi, {firstName ?? "there"}!</h1>
        <div className="mt-1.5 h-1 w-20 rounded-full bg-accent" />
        <p className="mt-3 text-sm text-muted">{user.email}</p>
      </div>

      {!user.emailVerified && (
        <div className={`${panel} flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5`}>
          <p className="text-sm text-muted">Confirm your email so we can reach you about orders and password resets.</p>
          <ResendVerification />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={`${panel} p-5`}>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Orders</p>
          <p className="mt-2 text-3xl font-extrabold text-brand">{orders?.total ?? 0}</p>
        </div>
        <div className={`${panel} p-5`}>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Latest order</p>
          <p className="mt-2 text-lg font-bold text-brand">{latest ? STATUS[latest.status].label : "None yet"}</p>
          {latest && <p className="text-sm text-muted">{latest.orderNumber}</p>}
        </div>
        <div className={`${panel} p-5`}>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Addresses</p>
          {addresses.length > 0 ? (
            <Link href="/account/addresses" className="mt-2 block text-lg font-bold text-success hover:underline">
              {addresses.length} saved
            </Link>
          ) : (
            <Link href="/account/addresses" className="mt-2 block text-sm font-semibold text-accent-dark hover:underline">
              Save one to check out faster →
            </Link>
          )}
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Recent orders</h2>
          {orders && orders.total > 3 && (
            <Link href="/account/orders" className="text-sm font-semibold text-accent-dark hover:underline">
              View all
            </Link>
          )}
        </div>
        {!orders ? (
          <p className={`${panel} p-8 text-center text-muted`}>Your orders could not be loaded right now.</p>
        ) : orders.items.length === 0 ? (
          <div className={`${panel} p-10 text-center`}>
            <p className="font-semibold text-brand">You have not placed an order yet</p>
            <Link href="/shop" className="mt-2 inline-block text-sm font-semibold text-accent-dark hover:underline">
              Start shopping →
            </Link>
          </div>
        ) : (
          <ul className={`${panel} divide-y divide-line`}>
            {orders.items.slice(0, 3).map((o) => (
              <OrderRow key={o.orderNumber} order={o} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function AccountPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
      <Overview searchParams={searchParams} />
    </Suspense>
  );
}
