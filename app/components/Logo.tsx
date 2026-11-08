import Image from "next/image";

/** The BongoMaker wordmark. Its purple and green need a light backdrop, so `onDark` sets it on a white pill. */
export function Logo({ className = "h-9", onDark = false }: { className?: string; onDark?: boolean }) {
  const img = <Image src="/bongomaker.png" alt="BongoMaker" width={764} height={157} priority className={`w-auto ${className}`} />;
  return onDark ? <span className="inline-block rounded-xl bg-white px-3 py-2">{img}</span> : img;
}
