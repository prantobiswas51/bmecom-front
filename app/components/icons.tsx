import type { SVGProps } from "react";

const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.600-7 10-7 10z" />,
  cart: <><path d="M3 4h2l2.2 11h10.600L20 8H6.200" /><circle cx="9" cy="19" r="1.500" /><circle cx="17" cy="19" r="1.500" /></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  bag: <><path d="M5 8h14l-1 12H6z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  flame: <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" />,
  gift: <><path d="M4 11h16v9H4zM3 8h18v3H3zM12 8v12" /><path d="M12 8c-3 0-4-3-2-4s3 1 2 4zm0 0c3 0 4-3 2-4s-3 1-2 4z" /></>,
  spark: <path d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />,
  shield: <><path d="M12 3 5 6v6c0 4.500 3 7.500 7 9 4-1.500 7-4.500 7-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.500" /><circle cx="17" cy="18" r="1.500" /></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14-4M4 5v3h3" /><path d="M4 13a8 8 0 0 0 14 4m2 2v-3h-3" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  star: <path d="m12 3 2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z" />,
  mail: <><path d="M3 6h18v12H3z" /><path d="m3 7 9 7 9-7" /></>,
  phone: <path d="M6 3h4l1.500 5-2.500 1.500a11 11 0 0 0 6 6L16.500 13l5 1.500v4A2 2 0 0 1 19.500 20 16 16 0 0 1 4 4.500 2 2 0 0 1 6 3z" />,
  check: <path d="m5 12.500 4.500 4.500L19 7.500" />,
  eye: <><path d="M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.600 6.100A10 10 0 0 1 12 5c6.500 0 10 7 10 7a17 17 0 0 1-3.200 4M6.600 6.600A17 17 0 0 0 2 12s3.500 7 10 7a9.700 9.700 0 0 0 4-.9" /><path d="M9.900 9.900a3 3 0 0 0 4.200 4.200" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.500-7 8-7s8 3 8 7" /></>,
  pin: <><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.500" /></>,
  brush: <><path d="M20 4c-5 1-9 5-10.500 9l1.500 1.500C15 13 19 9 20 4z" /><path d="M9.500 14c-2 0-3.500 1.500-3.500 3.500 0 1-.5 2-2 2.500 3 1 7 .5 8-3" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1.500 0 2-1 1.500-2s-.5-2 1-2H17a4 4 0 0 0 4-4c0-5-4-10-9-10z" /><circle cx="7.500" cy="11" r="1" /><circle cx="10" cy="7.500" r="1" /><circle cx="15" cy="7.500" r="1" /></>,
  pen: <><path d="m4 20 1-4L16.500 4.500a2 2 0 0 1 3 3L8 19z" /><path d="m14 7 3 3" /></>,
  paper: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4M9 12h7M9 16h7" /></>,
  canvas: <><rect x="4" y="4" width="16" height="16" rx="1" /><path d="m4 16 5-5 4 4 3-3 4 4" /></>,
  tag: <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.500" cy="8.500" r="1" /></>,
};

/** Picks a menu icon for a category from its name; anything unrecognised gets a tag. */
export function categoryIcon(name: string): IconName {
  const n = name.toLowerCase();
  if (/brush/.test(n)) return "brush";
  if (/paint|colou?r|acrylic|ink/.test(n)) return "palette";
  if (/pen|marker|pencil/.test(n)) return "pen";
  if (/pad|paper|book|stationery|note/.test(n)) return "paper";
  if (/canvas|frame|art/.test(n)) return "canvas";
  return "tag";
}

export type IconName = keyof typeof paths;

type Props = SVGProps<SVGSVGElement> & { name: IconName; filled?: boolean };

export function Icon({ name, filled = false, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.800"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
