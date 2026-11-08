import { Suspense } from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { AccountNav } from "./_components/AccountNav";
import { LogoutButton } from "./_components/actions";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          <aside className="lg:sticky lg:top-40 lg:self-start">
            <Suspense fallback={<div className="h-12" aria-hidden="true" />}>
              <AccountNav />
            </Suspense>
            <div className="mt-3 hidden border-t border-line pt-3 lg:block">
              <LogoutButton />
            </div>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
