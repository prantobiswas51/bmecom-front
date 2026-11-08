"use client";

import { useActionState } from "react";
import { logoutAction, resendVerificationAction, type FormState } from "../../auth/actions";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";

export function ResendVerification() {
  const [state, action, pending] = useActionState<FormState>(resendVerificationAction, {});
  return (
    <form action={action} className="space-y-3">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.success && <Alert tone="success">{state.success}</Alert>}
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Sending..." : "Resend verification email"}
      </Button>
    </form>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" size="sm">Sign out</Button>
    </form>
  );
}
