import { imageUrl } from "../../lib/catalog";

export function LineThumb({ image, size = "h-20 w-20" }: { image: string | null; size?: string }) {
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element -- photos come from the API host, not a fixed domain
    <img src={imageUrl(image)} alt="" className={`${size} shrink-0 rounded-[var(--radius-btn)] border border-line object-cover`} />
  ) : (
    <div className={`${size} shrink-0 rounded-[var(--radius-btn)] bg-soft`} />
  );
}
