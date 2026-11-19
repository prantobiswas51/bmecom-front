import { tones, type ArtKind, type Tone } from "../data";

/**
 * Simple flat illustrations used in the home carousel and the sign-in panel.
 */
export function Art({ kind, tone, className = "" }: { kind: ArtKind; tone: Tone; className?: string }) {
  const { bg, fg } = tones[tone];
  const dark = "#0e0f51";
  const shapes: Record<ArtKind, React.ReactNode> = {
    // A microcontroller board: chip in the middle, pins down both sides.
    chip: (
      <>
        <rect x="34" y="30" width="72" height="82" rx="6" fill="#fff" />
        {[42, 54, 66, 78, 90, 102].map((y) => (
          <g key={y}>
            <rect x="26" y={y - 3} width="10" height="6" rx="2" fill={dark} />
            <rect x="104" y={y - 3} width="10" height="6" rx="2" fill={dark} />
          </g>
        ))}
        <rect x="50" y="48" width="40" height="40" rx="4" fill={dark} />
        <circle cx="58" cy="56" r="3" fill="#fff" opacity=".8" />
        <rect x="58" y="66" width="24" height="4" rx="2" fill={fg} />
        <rect x="58" y="75" width="16" height="4" rx="2" fill={fg} opacity=".6" />
        <rect x="46" y="96" width="20" height="8" rx="2" fill={fg} opacity=".5" />
      </>
    ),
    // A light bulb with a glow.
    bulb: (
      <>
        <circle cx="70" cy="62" r="40" fill="#fff" opacity=".35" />
        <path d="M70 26c-18 0-30 13-30 29 0 11 6 17 11 23 3 4 4 7 4 12h30c0-5 1-8 4-12 5-6 11-12 11-23 0-16-12-29-30-29z" fill="#fff" />
        <path d="M60 62l10 14 10-14M70 76v14" fill="none" stroke={fg} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="55" y="94" width="30" height="8" rx="3" fill={dark} />
        <rect x="59" y="104" width="22" height="7" rx="3" fill={dark} opacity=".8" />
      </>
    ),
    // A 3D printer: frame, gantry, nozzle and a part on the bed.
    printer: (
      <>
        <rect x="32" y="28" width="8" height="80" rx="3" fill={dark} />
        <rect x="100" y="28" width="8" height="80" rx="3" fill={dark} />
        <rect x="32" y="28" width="76" height="8" rx="3" fill={dark} />
        <rect x="40" y="52" width="60" height="7" rx="3" fill={fg} />
        <rect x="62" y="44" width="16" height="16" rx="3" fill="#fff" />
        <path d="M66 60h8l-4 9z" fill={dark} />
        <rect x="36" y="100" width="68" height="10" rx="3" fill="#fff" />
        <rect x="58" y="84" width="24" height="16" rx="2" fill={fg} />
        <path d="M58 90h24M58 95h24" stroke="#fff" strokeWidth="2" opacity=".6" />
      </>
    ),
    // A switching power supply (SMPS) box with terminals and a fan grille.
    supply: (
      <>
        <rect x="26" y="40" width="88" height="60" rx="6" fill="#fff" />
        <rect x="26" y="40" width="88" height="12" rx="6" fill={fg} />
        <circle cx="52" cy="76" r="14" fill="none" stroke={dark} strokeWidth="4" />
        <path d="M52 66v20M42 76h20" stroke={dark} strokeWidth="3" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={78 + i * 8} y="94" width="5" height="10" rx="1" fill={dark} />
        ))}
        <path d="M80 62h26M80 72h20M80 82h24" stroke={fg} strokeWidth="4" strokeLinecap="round" opacity=".6" />
        <path d="M70 22l-8 14h8l-4 12 12-16h-8l4-10z" fill="#f97316" />
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
