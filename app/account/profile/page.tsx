import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "../../components/ui/Button";
import { getCurrentUser } from "../../lib/session";
import { ResendVerification } from "../_components/actions";
import { PasswordForm, ProfileForm } from "../_components/ProfileForms";

export const metadata: Metadata = { title: "Profile | BongoMaker Store" };

const panel = "rounded-[var(--radius-card)] border border-line bg-white p-5 sm:p-6";
const heading = "text-xs font-bold uppercase tracking-[0.08em] text-faint";

async function Profile() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/account/profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.375rem] font-bold text-brand sm:text-[2rem] sm:leading-tight">Profile &amp; security</h1>
        <div className="mt-1.5 h-1 w-20 rounded-full bg-accent" />
      </div>

      <section className={panel}>
        <h2 className={`${heading} mb-5`}>Your name</h2>
        <ProfileForm name={user.name ?? ""} />
      </section>

      <section className={panel}>
        <h2 className={heading}>Email</h2>
        <p className="mt-3 break-all font-semibold text-ink">{user.email}</p>
        {user.emailVerified ? (
          <span className="mt-2 inline-block rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-bold text-success">Verified</span>
        ) : (
          <div className="mt-3">
            <ResendVerification />
          </div>
        )}
      </section>

      {/* Placeholder until SMS one-time codes are available: nothing is saved or sent yet. */}
      <section className={panel} aria-labelledby="mobile-heading">
        <div className="flex items-center gap-3">
          <h2 id="mobile-heading" className={heading}>Mobile number</h2>
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">Upcoming</span>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3 opacity-60">
          <div className="min-w-0 flex-1 basis-56">
            <label htmlFor="mobile-soon" className="mb-1.5 block text-sm font-semibold text-brand">
              Mobile number
            </label>
            <input
              id="mobile-soon"
              type="tel"
              disabled
              placeholder="01712345678"
              className="w-full rounded-[var(--radius-btn)] border border-line bg-soft px-4 py-3 text-sm text-ink"
            />
          </div>
          <Button type="button" variant="outline" disabled>
            Send code
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted">
          You will soon be able to verify your mobile number with an SMS code, and use it to sign in and get order updates.
          We will let you know when it is ready.
        </p>
      </section>

      <section className={panel}>
        <h2 className={`${heading} mb-5`}>Change password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
      <Profile />
    </Suspense>
  );
}
