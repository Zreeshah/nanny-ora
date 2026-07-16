import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Family Account",
  description: "Create a free NannyOra family account to browse verified Auckland nannies.",
  alternates: { canonical: "/register-family" },
  // Signup page — noindex to keep thin/duplicate auth pages out of search.
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
