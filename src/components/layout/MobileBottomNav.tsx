"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, PlusCircle, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/find-a-nanny", label: "Search", icon: Search },
  { href: "/post-a-job", label: "Post Job", icon: PlusCircle },
  { href: "/login", label: "Account", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="md:hidden fixed bottom-5 left-5 right-5 z-50 bg-card/80 backdrop-blur-lg border border-border/25 rounded-full shadow-xl px-2 py-1.5"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-full min-w-[56px] min-h-[44px] transition-all duration-300 relative",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "stroke-[2.5] scale-105")} aria-hidden="true" />
              <span className="text-[9px] font-semibold tracking-wide leading-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
