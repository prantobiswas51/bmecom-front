import Link from "next/link";
import { Icon } from "./icons";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "New arrivals", href: "/shop?sort=newest" },
      { label: "Cart", href: "/cart" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Your account",
    links: [
      { label: "Login", href: "/auth/login" },
      { label: "Create an account", href: "/auth/signup" },
      { label: "My orders", href: "/account/orders" },
      { label: "My addresses", href: "/account/addresses" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 bg-brand text-white">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(2,1fr)]">
        <div>
          <Logo onDark className="h-10" />
          <p className="mt-3 max-w-xs text-sm text-white/70">
            Art supplies, stationery and craft materials, delivered across Bangladesh.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2"><Icon name="whatsapp" width={16} height={16} aria-label="WhatsApp" role="img" /> 01761387787</li>
            <li className="flex items-center gap-2"><Icon name="mail" width={16} height={16} /> support@bongomaker.com</li>
            <li className="flex items-center gap-2"><Icon name="pin" width={16} height={16} /> Magura, Bangladesh</li>
          </ul>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-accent">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © BongoMaker Store. All rights reserved.
      </div>
    </footer>
  );
}
