import type { Metadata } from "next";
import { getPublicNannies } from "@/lib/data/nannies";
import { FindANannyArticle } from "./FindANannyArticle";

export const metadata: Metadata = {
  title: "Hire a Nanny in NZ | Browse Auckland Profiles",
  description:
    "Find a nanny for recurring, newborn, after-school or short-term care. Browse Auckland profiles by availability, suburb, experience and verification level.",
  alternates: {
    canonical: "https://www.nannyora.co.nz/find-a-nanny",
  },
};

export const revalidate = 300;

export default async function FindANannyPage() {
  const allNannies = await getPublicNannies();
  return <FindANannyArticle allNannies={allNannies} />;
}
