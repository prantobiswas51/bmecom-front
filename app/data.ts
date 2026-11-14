// Static content for the landing page. Products, categories, brands and reviews come from the API.

export type ArtKind = "paint" | "brush" | "pencil" | "notebook" | "marker" | "scissors" | "canvas" | "palette";

export type Tone = "sky" | "mint" | "sun" | "lilac" | "rose" | "peach";

export const tones: Record<Tone, { bg: string; fg: string }> = {
  sky: { bg: "#dbeafe", fg: "#3b82f6" },
  mint: { bg: "#d1fae5", fg: "#10b981" },
  sun: { bg: "#fef3c7", fg: "#f59e0b" },
  lilac: { bg: "#ede9fe", fg: "#8b5cf6" },
  rose: { bg: "#ffe4e6", fg: "#f43f5e" },
  peach: { bg: "#ffedd5", fg: "#f97316" },
};

export const navChips = [
  { label: "Shop", icon: "bag", href: "/shop" },
  { label: "New Arrival", icon: "spark", href: "/shop?sort=newest" },
  { label: "Blog", icon: "paper", href: "/blog" },
] as const;

export const slides = [
  {
    eyebrow: "New season",
    title: "Everything you need to create",
    body: "Paints, brushes, sketchbooks and more from trusted brands.",
    cta: "Shop art supplies",
    href: "/shop",
    tone: "sky" as Tone,
    kind: "palette" as ArtKind,
  },
  {
    eyebrow: "Just landed",
    title: "Fresh stock, every week",
    body: "See the newest paints, pens, notebooks and craft supplies.",
    cta: "See new arrivals",
    href: "/shop?sort=newest",
    tone: "sun" as Tone,
    kind: "notebook" as ArtKind,
  },
  {
    eyebrow: "Easy ordering",
    title: "Order now, pay on delivery",
    body: "No account needed. Check out as a guest and pay when it arrives.",
    cta: "Start shopping",
    href: "/shop",
    tone: "mint" as Tone,
    kind: "paint" as ArtKind,
  },
];

export const usps = [
  { icon: "shield", title: "Genuine products", body: "Sourced from authorised brands" },
  { icon: "truck", title: "Fast delivery", body: "Inside Dhaka in 24 to 48 hours" },
  { icon: "refresh", title: "Easy returns", body: "7 days, no questions asked" },
  { icon: "chat", title: "Real support", body: "Chat with us every day, 10am to 10pm" },
] as const;
