"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const role = (session.user as any)?.role;

  return (
    <div className="min-h-dvh bg-muted/30">
      {/* Dashboard Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-heading text-sm font-bold">N</span>
                </div>
                <span className="font-heading text-lg text-foreground">NannyOra</span>
              </Link>

              {role === "NANNY" && (
                <nav className="hidden sm:flex items-center gap-1 ml-4">
                  <Link href="/dashboard/nanny" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/nanny/profile" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    My Profile
                  </Link>
                  <Link href="/dashboard/nanny/enquiries" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    Enquiries
                  </Link>
                </nav>
              )}

              {role === "PARENT" && (
                <nav className="hidden sm:flex items-center gap-1 ml-4">
                  <Link href="/dashboard/parent" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/find-a-nanny" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    Find a Nanny
                  </Link>
                  <Link href="/post-a-job" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                    Post a Job
                  </Link>
                </nav>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-xs">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-foreground">{session.user?.name}</span>
                  <span className="text-muted-foreground ml-1.5 text-xs px-2 py-0.5 rounded-full bg-muted">
                    {role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-muted"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav for nanny */}
      {role === "NANNY" && (
        <nav className="sm:hidden bg-card border-b border-border px-4 py-2 flex gap-1 overflow-x-auto">
          <Link href="/dashboard/nanny" className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg whitespace-nowrap">Dashboard</Link>
          <Link href="/dashboard/nanny/profile" className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg whitespace-nowrap">My Profile</Link>
          <Link href="/dashboard/nanny/enquiries" className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg whitespace-nowrap">Enquiries</Link>
        </nav>
      )}

      {/* Mobile nav for parent */}
      {role === "PARENT" && (
        <nav className="sm:hidden bg-card border-b border-border px-4 py-2 flex gap-1 overflow-x-auto">
          <Link href="/dashboard/parent" className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg whitespace-nowrap">Dashboard</Link>
          <Link href="/find-a-nanny" className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg whitespace-nowrap">Find a Nanny</Link>
          <Link href="/post-a-job" className="px-3 py-1.5 text-sm text-muted-foreground rounded-lg whitespace-nowrap">Post a Job</Link>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
