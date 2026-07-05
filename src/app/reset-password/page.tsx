"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { resetPassword } from "@/server/actions/password";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirmPassword") || "");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setIsLoading(true);
    const res = await resetPassword(token, password);
    setIsLoading(false);
    if (!res.success) return setError(res.error || "Something went wrong.");
    setDone(true);
    setTimeout(() => router.push("/login"), 2500);
  };

  if (!token) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        This reset link is incomplete.{" "}
        <Link href="/forgot-password" className="text-primary font-bold">Request a new one</Link>.
      </p>
    );
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-badge-verified flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-lg text-foreground mb-2">Password updated</h2>
        <p className="text-sm text-muted-foreground">Taking you to sign in…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-destructive/10 text-destructive text-xs font-medium" role="alert">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      <Input name="password" label="New password" type="password" required placeholder="At least 6 characters" autoComplete="new-password" />
      <Input name="confirmPassword" label="Confirm new password" type="password" required placeholder="Re-enter password" autoComplete="new-password" />
      <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading} className="rounded-full shadow-lg mt-2">
        Set new password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1 mb-6 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.png" alt="NannyOra" className="h-11 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-2">Choose a new password</h1>
        </div>
        <Card className="rounded-3xl border border-border/40 shadow-xl">
          {/* useSearchParams needs a Suspense boundary in App Router */}
          <Suspense fallback={null}>
            <ResetForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
