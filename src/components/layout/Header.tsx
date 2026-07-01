"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/find-a-nanny", label: "Find a Nanny" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/trust-and-safety", label: "Trust & Safety" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = status === "authenticated" && session?.user;
  const role = (session?.user as any)?.role;

  const dashboardHref =
    role === "ADMIN" ? "/admin" :
    role === "NANNY" ? "/dashboard/nanny" :
    role === "PARENT" ? "/dashboard/parent" :
    "/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-md border-b border-border/30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 group">
            <img
              src="/logo.png"
              alt="NannyOra"
              className="h-12 md:h-20 w-auto rounded-md transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <span className="sm:hidden text-[9px] font-semibold text-muted-foreground tracking-wide leading-tight">
              Curated Care. Warm Hearts.
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5 bg-secondary/40 p-1 rounded-full border border-border/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  pathname === link.href
                    ? "text-primary-foreground bg-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link href={dashboardHref}>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/20">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-xs">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">{session.user?.name}</span>
                  <span className="text-[9px] font-bold text-muted-foreground px-1.5 py-0.5 rounded-full bg-background border border-border/30">
                    {role}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all cursor-pointer p-1.5 rounded-full"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold">Log In</Button>
                </Link>
                <Link href="/apply-as-nanny">
                  <Button variant="outline" size="sm" className="text-xs font-semibold">Become a Nanny</Button>
                </Link>
                <Link href="/register-family">
                  <Button variant="accent" size="sm" className="text-xs font-semibold">Find a Nanny</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/20 animate-fade-in">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-base font-semibold rounded-2xl transition-colors min-h-[44px]",
                    pathname === link.href
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/20 space-y-2 px-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-secondary/30 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-sm">{session.user?.name}</span>
                      <span className="text-[10px] font-bold text-muted-foreground ml-1.5 px-1.5 py-0.5 rounded-full bg-background border border-border/30">
                        {role}
                      </span>
                    </div>
                  </div>
                  <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth className="rounded-full">
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    fullWidth
                    className="rounded-full"
                    onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" fullWidth className="rounded-full">Log In</Button>
                  </Link>
                  <Link href="/register-family" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="accent" fullWidth className="rounded-full">Find a Nanny</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
