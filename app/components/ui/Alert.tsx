import type { ReactNode } from "react";

const tones = {
  error: "border-danger/20 bg-red-50 text-danger",
  success: "border-success/20 bg-success-soft text-success",
  info: "border-line bg-soft text-brand",
} as const;

export function Alert({ tone = "info", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-[var(--radius-btn)] border px-4 py-3 text-sm font-medium ${tones[tone]}`}
    >
      {children}
    </p>
  );
}
