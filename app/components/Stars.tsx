const STAR = "m12 2.500 2.900 5.900 6.500.9-4.700 4.600 1.100 6.500L12 17.300 6.200 20.400l1.100-6.500L2.600 9.300l6.500-.9z";

function Row({ className }: { className: string }) {
  return (
    <span className="flex">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className={`h-[1em] w-[1em] shrink-0 ${className}`} fill="currentColor" aria-hidden="true">
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

/** A 0 to 5 star rating, including part stars (4.3 fills the fifth star by 30%). Size it with a text-* class. */
export function Stars({ value, className = "text-base" }: { value: number; className?: string }) {
  const percent = Math.max(0, Math.min(5, value)) * 20;
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className={`relative inline-flex ${className}`}>
      <Row className="text-line" />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${percent}%` }}>
        <Row className="text-accent" />
      </span>
    </span>
  );
}
