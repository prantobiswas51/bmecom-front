import { Suspense } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { AccountNav } from "./_components/AccountNav";
import { getCurrentUser } from "../lib/session";
import { LogoutButton, ResendVerification } from "./_components/actions";

/** Signed-in people see the dashboard only once their email is verified; until then, just a prompt to verify. */
async function Shell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user && !user.emailVerified) {
    return (
      <div className="mx-auto max-w-lg rounded-[var(--radius-card)] border border-line bg-white p-6 text-center sm:p-8">
        <h1 className="text-xl font-bold text-brand">Verify your email to continue</h1>
        <p className="mt-3 text-sm text-muted">
          We sent a link to <strong className="text-ink">{user.email}</strong>. Open it to unlock your account. Until
          then, orders you place are treated as guest orders, and whoever verifies an email first keeps it.
        </p>
        <div className="mt-5 flex flex-col items-center gap-3">
          <ResendVerification />
          <LogoutButton />
        </div>
      </div>
    );
  }
  return (
    /* minmax(0, 1fr) keeps the single phone column from growing to fit the tab strip, which scrolls sideways instead. */
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
      <aside className="hidden min-w-0 lg:sticky lg:top-40 lg:block lg:self-start">
        <Suspense fallback={<div className="h-12" aria-hidden="true" />}>
          <AccountNav />
        </Suspense>
        <div className="mt-3 hidden border-t border-line pt-3 lg:block">
          <LogoutButton />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Suspense fallback={<div className="min-h-[50vh]" aria-hidden="true" />}>
          <Shell>{children}</Shell>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
