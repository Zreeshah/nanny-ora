import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Nanny in Auckland",
  description:
    "Join NannyOra as a nanny in Auckland. Free to apply — get verified, build your profile and receive enquiries from local families.",
  alternates: { canonical: "/apply-as-nanny" },
  openGraph: {
    title: "Become a Nanny in Auckland",
    description: "Get verified, build your profile, and receive bookings from Auckland families.",
    url: "/apply-as-nanny",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
