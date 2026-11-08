import type { Theme } from "./settings";

const HEX = /^#[0-9a-f]{6}$/i;
const mix = (color: string, percent: number, other = "white") => `color-mix(in srgb, ${color} ${percent}%, ${other})`;

/**
 * A stylesheet that re-points the design tokens in globals.css at the admin's colours. Tints,
 * borders and muted text are worked out from the eight chosen colours.
 * Values are checked as hex codes first, since they end up inside a <style> tag.
 */
export function themeCss(theme: Theme | null): string | null {
  if (!theme || !Object.values(theme).every((v) => HEX.test(v))) return null;
  const t = theme;
  const vars: Record<string, string> = {
    "--color-brand": t.primary,
    "--color-brand-hover": t.primaryDark,
    "--color-accent": t.secondary,
    "--color-accent-hover": t.secondaryDark,
    "--color-accent-dark": t.secondaryDark,
    "--color-accent-soft": mix(t.secondary, 10),
    "--color-soft": t.tertiary,
    "--color-ink": t.other,
    "--color-muted": mix(t.other, 68),
    "--color-faint": mix(t.other, 45),
    "--color-line": mix(t.primary, 10),
    "--color-success": t.accent,
    "--color-success-soft": mix(t.accent, 8),
    "--shadow-brand": `0 10px 15px -3px ${mix(t.primary, 25, "transparent")}, 0 4px 6px -4px ${mix(t.primary, 25, "transparent")}`,
    "--shadow-card": `0 1px 2px ${mix(t.primary, 5, "transparent")}, 0 8px 24px -12px ${mix(t.primary, 18, "transparent")}`,
  };
  // :root:root outranks the plain :root that Tailwind writes its tokens on.
  return `:root:root{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";")}}`;
}
