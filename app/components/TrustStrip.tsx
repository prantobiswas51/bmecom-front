import { usps } from "../data";
import { Icon } from "./icons";

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="mx-auto w-full max-w-[1440px] px-4 pt-8 sm:px-6">
      <ul className="grid grid-cols-2 gap-3 rounded-[var(--radius-card)] border border-line bg-white p-4 lg:grid-cols-4 lg:p-5">
        {usps.map((u) => (
          <li key={u.title} className="flex items-center gap-3 p-2">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-dark">
              <Icon name={u.icon} />
            </span>
            <div>
              <p className="text-sm font-bold text-brand">{u.title}</p>
              <p className="text-xs text-muted">{u.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
