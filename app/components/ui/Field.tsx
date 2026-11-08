"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Icon } from "../icons";

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  hint?: string;
  /** Shown in the label row, e.g. a "Forgot password?" link. */
  aside?: React.ReactNode;
};

/** Labelled text input. Password fields get a show/hide toggle. */
export function Field({ label, hint, aside, type = "text", className = "", ...input }: FieldProps) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-brand">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <input
          id={id}
          type={isPassword && shown ? "text" : type}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`h-12 w-full rounded-[var(--radius-btn)] border border-line bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-faint focus:border-brand focus:ring-4 focus:ring-brand/10 ${isPassword ? "pr-12" : ""}`}
          {...input}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:text-brand"
          >
            <Icon name={shown ? "eyeOff" : "eye"} width={18} height={18} />
          </button>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
