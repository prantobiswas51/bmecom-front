import Link from "next/link";
import { Art } from "../components/Art";
import { Icon } from "../components/icons";
import { Logo } from "../components/Logo";

const perks = [
  "10% off your first order",
  "Track every order in one place",
  "Save favourites to your wishlist",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-brand p-12 text-white lg:flex lg:flex-col">
        <Link href="/" aria-label="BongoMaker home">
          <Logo onDark className="h-10" />
        </Link>

        <div className="my-auto max-w-md">
          <h2 className="text-balance text-4xl font-extrabold leading-[1.15]">
            Everything you need to create
          </h2>
          <div className="mt-4 h-1 w-14 rounded-full bg-accent" />
          <p className="mt-5 text-white/70">
            Art supplies, stationery and craft materials, delivered across Bangladesh.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                  <Icon name="check" width={14} height={14} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="pointer-events-none absolute -bottom-10 -right-10 grid grid-cols-2 gap-4 opacity-90">
          <Art kind="palette" tone="sky" className="h-40 w-40 rounded-[2.5rem]" />
          <Art kind="brush" tone="mint" className="h-40 w-40 rounded-[2.5rem]" />
        </div>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <Link href="/" aria-label="BongoMaker home" className="mb-8 lg:hidden">
          <Logo className="h-10" />
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6">{children}</div>
        <p className="text-center text-xs text-muted">© BongoMaker Store</p>
      </main>
    </div>
  );
}
