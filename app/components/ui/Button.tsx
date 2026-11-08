import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "../icons";

const variants = {
  primary: "bg-brand text-white shadow-brand hover:bg-brand-hover",
  accent: "bg-accent text-white hover:bg-accent-hover",
  outline: "border border-brand text-brand hover:bg-brand hover:text-white",
} as const;

const sizes = {
  xs: "px-4 py-2 text-xs font-bold uppercase tracking-wider",
  sm: "px-4 py-1.5 text-sm font-semibold",
  md: "px-6 py-3 text-sm font-semibold",
  lg: "h-12 px-7 text-sm font-bold",
} as const;

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Icon shown before the label. */
  icon?: IconName;
  /** Icon shown after the label. */
  iconRight?: IconName;
};

type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;
type AsButton = Common & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = AsLink | AsButton;

/**
 * The one button for the site. Renders a link when `href` is given, otherwise a button.
 * Use `className` for layout only (width, margin, position), not for colours or sizes.
 */
export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon,
    iconRight,
    className = "",
    children,
    ...rest
  } = props;

  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] transition",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");

  const content = (
    <>
      {icon && <Icon name={icon} width={18} height={18} />}
      {children}
      {iconRight && <Icon name={iconRight} width={16} height={16} />}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchor } = rest as Omit<AsLink, keyof Common>;
    return (
      <Link href={href} className={classes} {...anchor}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...button } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type} className={classes} {...button}>
      {content}
    </button>
  );
}
