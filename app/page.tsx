import { Suspense } from "react";
import { Categories } from "./components/Categories";
import { Footer } from "./components/Footer";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NewArrivals } from "./components/ProductRail";
import { Brands } from "./components/Promo";
import { Reviews } from "./components/Reviews";
import { TrustStrip } from "./components/TrustStrip";

/** Keeps the page's height steady while a section waits for the catalog. */
function Skeleton({ className }: { className: string }) {
  return <div aria-hidden="true" className={`mx-auto my-8 w-full max-w-[1440px] animate-pulse rounded-[var(--radius-card)] bg-soft ${className}`} />;
}

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Suspense fallback={<Skeleton className="h-80" />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-96" />}>
          <NewArrivals />
        </Suspense>
        <Suspense fallback={null}>
          <Brands />
        </Suspense>
        <Suspense fallback={null}>
          <Reviews />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
