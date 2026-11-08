import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, linkClass } from "../_components/AuthCard";
import { SignupForm } from "../_components/forms";

export const metadata: Metadata = { title: "Create account | BongoMaker Store" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Get 10% off your first order when you join."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className={linkClass}>Sign in</Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
