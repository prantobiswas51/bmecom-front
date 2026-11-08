import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard, linkClass } from "../_components/AuthCard";
import { LoginForm } from "../_components/forms";

export const metadata: Metadata = { title: "Sign in | BongoMaker Store" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function Form({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const notice = params.reset ? "Your password was updated. Sign in with the new one." : undefined;
  return <LoginForm next={next} notice={notice} />;
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to track orders and check out faster."
      footer={
        <>
          New to BongoMaker?{" "}
          <Link href="/auth/signup" className={linkClass}>Create an account</Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64" aria-hidden="true" />}>
        <Form searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}
