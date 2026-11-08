"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import {
  forgotPasswordAction,
  loginAction,
  resetPasswordAction,
  signupAction,
  verifyEmailAction,
  type FormState,
} from "../actions";
import { linkClass } from "./AuthCard";

const initial: FormState = {};

export function LoginForm({ next, notice }: { next?: string; notice?: string }) {
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-5">
      {notice && !state.error && <Alert tone="success">{notice}</Alert>}
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {next && <input type="hidden" name="next" value={next} />}
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Your password"
        aside={
          <Link href="/auth/forgot-password" className="text-xs font-semibold text-accent-dark hover:underline">
            Forgot password?
          </Link>
        }
      />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, initial);
  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        maxLength={100}
        defaultValue={state.values?.name}
        placeholder="Your name (optional)"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={128}
        placeholder="At least 8 characters"
        hint="Use 8 or more characters. A longer phrase is stronger."
      />
      <Field
        label="Confirm password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={128}
        placeholder="Type it again"
      />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-xs text-muted">
        By creating an account you agree to our{" "}
        <Link href="#" className={linkClass}>Terms</Link> and{" "}
        <Link href="#" className={linkClass}>Privacy Policy</Link>.
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);
  if (state.success) {
    return (
      <div className="space-y-5">
        <Alert tone="success">{state.success}</Alert>
        <p className="text-sm text-muted">
          Nothing arrived? Check your spam folder, or reload this page to try again.
        </p>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        placeholder="you@example.com"
      />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, initial);
  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <Alert tone="error">
          {state.error}{" "}
          {state.error.includes("expired") && (
            <Link href="/auth/forgot-password" className="underline">Request a new link</Link>
          )}
        </Alert>
      )}
      <input type="hidden" name="token" value={token} />
      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={128}
        placeholder="At least 8 characters"
      />
      <Field
        label="Confirm new password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={128}
        placeholder="Type it again"
      />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving..." : "Set new password"}
      </Button>
    </form>
  );
}

export function VerifyEmailForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(verifyEmailAction, initial);
  if (state.success) {
    return (
      <div className="space-y-5">
        <Alert tone="success">{state.success}</Alert>
        <Button href="/account" size="lg" className="w-full">Go to my account</Button>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <input type="hidden" name="token" value={token} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Verifying..." : "Verify my email"}
      </Button>
    </form>
  );
}
