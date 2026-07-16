import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Nanny in Auckland — Apply to NannyOra",
  description:
    "Join NannyOra as a professional nanny in Auckland. Free to apply — get verified, build your profile, and receive enquiries and bookings from local families. No monthly fee.",
  alternates: { canonical: "/apply-as-nanny" },
  openGraph: {
    title: "Become a Nanny in Auckland — Apply to NannyOra",
    description: "Get verified, build your profile, and receive bookings from Auckland families.",
    url: "/apply-as-nanny",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
