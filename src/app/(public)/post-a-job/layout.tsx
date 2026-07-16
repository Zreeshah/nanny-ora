import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Childcare Job",
  description:
    "Post a childcare job to reach verified Auckland nannies. Describe your family's needs and receive applications from professional carers.",
  alternates: { canonical: "/post-a-job" },
  // Conversion/app page — keep it out of the index to avoid thin content.
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
