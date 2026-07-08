"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Redirect based on role — fetch the session to check
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "NANNY") {
        router.push("/dashboard/nanny");
      } else if (role === "PARENT") {
        router.push("/dashboard/parent");
      } else {
        router.push(callbackUrl);
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex flex-col items-center gap-1 mb-6 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-wordmark.png" alt="NannyOra" className="h-11 w-auto transition-transform group-hover:scale-105" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/80">Curated Care. Warm Hearts.</span>
        </Link>
        <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your NannyOra account</p>
      </div>

      <Card className="rounded-3xl border border-border/40 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-destructive/10 text-destructive text-xs font-medium" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <Input
            name="email"
            label="Email"
            type="email"
            required
            placeholder="you@email.com"
            autoComplete="email"
          />
          <Input
            name="password"
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-light transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading} className="rounded-full shadow-lg mt-2">
            Sign In
          </Button>
        </form>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register-family" className="text-primary hover:text-primary-light font-bold transition-colors">
          Register as a family
        </Link>
        {" or "}
        <Link href="/apply-as-nanny" className="text-primary hover:text-primary-light font-bold transition-colors">
          apply as a nanny
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-12 bg-background">
      <Suspense fallback={
        <div className="w-full max-w-md text-center">
          <div className="w-10 h-10 rounded-lg bg-primary/20 mx-auto mb-4 skeleton" />
          <div className="h-6 w-48 mx-auto mb-2 skeleton" />
          <div className="h-4 w-64 mx-auto skeleton" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
