"use client";

type Props = {
  value: number;
  onChange: (next: number) => void;
  label: string;
  min?: number;
  max?: number;
};

const step =
  "flex h-9 w-9 items-center justify-center text-lg font-semibold text-brand transition hover:bg-soft disabled:opacity-40 disabled:hover:bg-transparent";

/** A − 1 + control for quantities. */
export function QtyStepper({ value, onChange, label, min = 1, max = 99 }: Props) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-[var(--radius-btn)] border border-line bg-white">
      <button type="button" aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)} className={step}>
        −
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className={step}>
        +
      </button>
    </div>
  );
}
