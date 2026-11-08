import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, linkClass } from "../_components/AuthCard";
import { ForgotPasswordForm } from "../_components/forms";

export const metadata: Metadata = { title: "Reset password | BongoMaker Store" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we will send you a link to choose a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/auth/login" className={linkClass}>Back to sign in</Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
