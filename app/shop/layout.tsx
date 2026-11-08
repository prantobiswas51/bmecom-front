import { AnnouncementBar } from "../components/AnnouncementBar";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6">{children}</main>
      <Footer />
    </>
  );
}
