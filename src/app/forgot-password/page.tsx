"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { MailCheck } from "lucide-react";
import { requestPasswordReset } from "@/server/actions/password";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "");
    if (!email) return;
    setIsLoading(true);
    await requestPasswordReset(email);
    setIsLoading(false);
    setSent(true); // action always "succeeds" — no account enumeration
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1 mb-6 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-wordmark.png" alt="NannyOra" className="h-11 w-auto transition-transform group-hover:scale-105" />
          </Link>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-2">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        <Card className="rounded-3xl border border-border/40 shadow-xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-badge-verified flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <MailCheck className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-lg text-foreground mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                If that email has a NannyOra account, a reset link is on its way. It expires in 1 hour.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input name="email" label="Email" type="email" required placeholder="you@email.com" autoComplete="email" />
              <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading} className="rounded-full shadow-lg mt-2">
                Send reset link
              </Button>
            </form>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Remembered it?{" "}
          <Link href="/login" className="text-primary hover:text-primary-light font-bold transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
