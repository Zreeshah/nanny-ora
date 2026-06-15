"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading admin...</span>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") return null;

  const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/nannies", label: "Nannies" },
    { href: "/admin/jobs", label: "Jobs" },
    { href: "/admin/enquiries", label: "Enquiries" },
  ];

  return (
    <div className="min-h-dvh bg-muted/30">
      {/* Admin Header */}
      <header className="bg-foreground text-primary-foreground sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-heading text-sm font-bold">N</span>
                </div>
                <span className="font-heading text-lg">Admin</span>
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-lg transition-colors",
                      pathname === item.href
                        ? "text-white bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60 hidden sm:inline">
                {session.user?.name}
              </span>
              <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">
                ← Site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-white/60 hover:text-white transition-colors cursor-pointer p-1.5 rounded"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile admin nav */}
      <nav className="sm:hidden bg-foreground/95 border-b border-white/10 px-4 py-2 flex gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap",
              pathname === item.href
                ? "text-white bg-white/10"
                : "text-white/70 hover:text-white"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
