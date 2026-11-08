import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Alert } from "../../components/ui/Alert";
import { AuthCard, linkClass } from "../_components/AuthCard";
import { ResetPasswordForm } from "../_components/forms";

export const metadata: Metadata = { title: "Choose a new password | BongoMaker Store" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function Form({ searchParams }: { searchParams: SearchParams }) {
  const { token } = await searchParams;
  if (typeof token !== "string" || !token) {
    return (
      <div className="space-y-4">
        <Alert tone="error">This reset link is missing or incomplete.</Alert>
        <Link href="/auth/forgot-password" className={linkClass}>Request a new link</Link>
      </div>
    );
  }
  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <AuthCard
      title="Choose a new password"
      subtitle="Pick something you have not used before. You will be signed out of your other devices."
    >
      <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
