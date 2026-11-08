import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Alert } from "../../components/ui/Alert";
import { AuthCard, linkClass } from "../_components/AuthCard";
import { VerifyEmailForm } from "../_components/forms";

export const metadata: Metadata = { title: "Verify email | BongoMaker Store" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// The token is only spent when the button is pressed, so email scanners that
// open links in advance cannot use it up.
async function Form({ searchParams }: { searchParams: SearchParams }) {
  const { token } = await searchParams;
  if (typeof token !== "string" || !token) {
    return (
      <div className="space-y-4">
        <Alert tone="error">This verification link is missing or incomplete.</Alert>
        <Link href="/account" className={linkClass}>Go to my account</Link>
      </div>
    );
  }
  return <VerifyEmailForm token={token} />;
}

export default function VerifyEmailPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <AuthCard title="Verify your email" subtitle="One more click and your email address is confirmed.">
      <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
