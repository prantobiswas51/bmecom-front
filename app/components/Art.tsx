import { tones, type ArtKind, type Tone } from "../data";

/**
 * Simple flat illustrations that stand in for product photos until real media
 * is served from the media folder.
 */
export function Art({ kind, tone, className = "" }: { kind: ArtKind; tone: Tone; className?: string }) {
  const { bg, fg } = tones[tone];
  const dark = "#0e0f51";
  const shapes: Record<ArtKind, React.ReactNode> = {
    paint: (
      <>
        <rect x="38" y="46" width="34" height="48" rx="6" fill={fg} />
        <rect x="42" y="36" width="26" height="12" rx="3" fill={dark} />
        <rect x="80" y="58" width="30" height="36" rx="6" fill="#fff" />
        <rect x="84" y="50" width="22" height="10" rx="3" fill={fg} opacity=".6" />
        <circle cx="55" cy="70" r="7" fill="#fff" opacity=".7" />
      </>
    ),
    brush: (
      <>
        <rect x="52" y="30" width="8" height="70" rx="4" fill={dark} transform="rotate(18 56 65)" />
        <path d="M44 104c4-10 14-12 16-4s-6 14-16 4z" fill={fg} />
        <rect x="76" y="34" width="8" height="66" rx="4" fill="#fff" transform="rotate(-14 80 67)" />
        <path d="M86 104c-2-9-12-12-15-5s7 14 15 5z" fill={dark} opacity=".8" />
      </>
    ),
    pencil: (
      <>
        <g transform="rotate(35 70 70)">
          <rect x="62" y="22" width="16" height="70" rx="2" fill={fg} />
          <path d="M62 92h16l-8 18z" fill="#fde7c2" />
          <path d="M67 104h6l-3 6z" fill={dark} />
          <rect x="62" y="22" width="16" height="10" rx="2" fill={dark} />
        </g>
      </>
    ),
    notebook: (
      <>
        <rect x="42" y="26" width="58" height="84" rx="6" fill="#fff" />
        <rect x="42" y="26" width="10" height="84" rx="4" fill={fg} />
        <rect x="60" y="42" width="30" height="5" rx="2.500" fill={dark} opacity=".8" />
        <rect x="60" y="56" width="26" height="4" rx="2" fill={fg} opacity=".5" />
        <rect x="60" y="66" width="30" height="4" rx="2" fill={fg} opacity=".5" />
      </>
    ),
    marker: (
      <>
        <g transform="rotate(-25 70 70)">
          <rect x="60" y="24" width="18" height="64" rx="5" fill={fg} />
          <rect x="60" y="24" width="18" height="12" rx="4" fill={dark} />
          <path d="M62 88h14l-3 14h-8z" fill="#fff" />
        </g>
        <g transform="rotate(12 100 80)">
          <rect x="92" y="38" width="14" height="52" rx="4" fill="#fff" />
          <rect x="92" y="38" width="14" height="10" rx="3" fill={fg} />
        </g>
      </>
    ),
    scissors: (
      <>
        <circle cx="52" cy="92" r="12" fill="none" stroke={dark} strokeWidth="6" />
        <circle cx="88" cy="92" r="12" fill="none" stroke={fg} strokeWidth="6" />
        <path d="M58 82 86 30M82 82 54 30" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      </>
    ),
    canvas: (
      <>
        <rect x="34" y="34" width="76" height="68" rx="4" fill="#fff" />
        <path d="M34 90 62 64l18 18 12-10 18 22v8H34z" fill={fg} opacity=".75" />
        <circle cx="90" cy="54" r="8" fill={dark} opacity=".8" />
      </>
    ),
    palette: (
      <>
        <path d="M70 30c-26 0-42 18-42 38 0 18 14 32 32 32 10 0 10-8 6-12-5-6 0-12 8-12h14c12 0 20-8 20-18C108 42 92 30 70 30z" fill="#fff" />
        <circle cx="52" cy="58" r="7" fill={fg} />
        <circle cx="72" cy="48" r="7" fill={dark} />
        <circle cx="94" cy="58" r="7" fill="#f97316" />
        <circle cx="50" cy="80" r="7" fill="#10b981" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 140 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <rect width="140" height="140" fill={bg} />
      <circle cx="112" cy="26" r="30" fill="#fff" opacity=".35" />
      <circle cx="22" cy="120" r="24" fill="#fff" opacity=".25" />
      {shapes[kind]}
    </svg>
  );
}
