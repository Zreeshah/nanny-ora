import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  // Absolute base for canonical + OG/Twitter image URLs. Without this, all those
  // URLs resolve relative and social/search previews break.
  metadataBase: new URL("https://www.nannyora.co.nz"),
  title: {
    default: "NannyOra — Trusted Nanny Care for Auckland Families",
    template: "%s | NannyOra",
  },
  description:
    "Find trusted, specialist nannies in Auckland — including sensory-aware, ECE, and highly experienced childcare support. NannyOra connects families with verified, professional carers.",
  applicationName: "NannyOra",
  keywords: [
    "nanny Auckland",
    "babysitter Auckland",
    "childcare Auckland",
    "sensory-aware nanny",
    "ECE nanny",
    "neurodiverse childcare",
    "specialist nanny NZ",
    "NannyOra",
  ],
  authors: [{ name: "NannyOra" }],
  creator: "NannyOra",
  publisher: "NannyOra",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: "https://www.nannyora.co.nz",
    siteName: "NannyOra",
    title: "NannyOra — Trusted Nanny Care for Auckland Families",
    description:
      "Find trusted, specialist nannies in Auckland — including sensory-aware, ECE, and highly experienced childcare support.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NannyOra — Trusted Auckland nannies" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NannyOra — Trusted Nanny Care for Auckland Families",
    description:
      "Find trusted, specialist nannies in Auckland — sensory-aware, ECE, and highly experienced childcare support.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F2E52",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
