import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const fontBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NannyOra — Trusted Nanny Care for Auckland Families",
    template: "%s | NannyOra",
  },
  description:
    "Find trusted, specialist nannies in Auckland — including sensory-aware, ECE, and highly experienced childcare support. NannyOra connects families with verified, professional carers.",
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
  openGraph: {
    type: "website",
    locale: "en_NZ",
    siteName: "NannyOra",
    title: "NannyOra — Trusted Nanny Care for Auckland Families",
    description:
      "Find trusted, specialist nannies in Auckland — including sensory-aware, ECE, and highly experienced childcare support.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1B6B5A",
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
      <body className={`min-h-dvh flex flex-col bg-background text-foreground font-body antialiased ${fontHeading.variable} ${fontBody.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
