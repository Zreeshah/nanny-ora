import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = {
  "For Families": [
    { href: "/find-a-nanny", label: "Find a Nanny" },
    { href: "/register-family", label: "Register as a Family" },
    { href: "/post-a-job", label: "Post a Job" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/childcare-support", label: "Childcare Support Options" },
  ],
  "For Nannies": [
    { href: "/apply-as-nanny", label: "Apply as a Nanny" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
  ],
  "Trust & Safety": [
    { href: "/verification-process", label: "Our Verification Process" },
    { href: "/trust-and-safety#guidelines", label: "Safety Guidelines" },
  ],
  "Specialist Care": [
    { href: "/specialist-childcare-auckland", label: "Specialist Childcare" },
    { href: "/sensory-aware-nanny-auckland", label: "Sensory-Aware Nannies" },
    { href: "/neurodiverse-childcare-auckland", label: "Neurodiverse Childcare" },
    { href: "/ece-nanny-auckland", label: "ECE Nannies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border/30 mt-auto text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={`${category}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-foreground/75 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex flex-col items-center md:items-start leading-none">
              <img
                src="/logo-wordmark.png"
                alt="NannyOra"
                className="h-10 md:h-12 w-auto"
              />
              <span className="mt-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-primary/80">
                Curated Care. Warm Hearts.
              </span>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NannyOra. Connecting Auckland families with trusted childcare.
            </p>

            {/* Auckland mention */}
            <p className="text-xs font-semibold text-muted-foreground/85">
              Auckland, New Zealand 🇳🇿
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
