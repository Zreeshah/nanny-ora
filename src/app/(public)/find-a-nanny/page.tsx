import type { Metadata } from "next";
import { getPublicNannies } from "@/lib/data/nannies";
import { FindANannyArticle } from "./FindANannyArticle";

export const metadata: Metadata = {
  title: "Hire a Nanny in NZ | Trusted Home Childcare | NannyOra",
  description:
    "Hire a nanny with confidence. Compare care options, understand costs and NZ employer duties, and browse trusted Auckland nanny profiles with NannyOra.",
  alternates: {
    canonical: "https://www.nannyora.co.nz/find-a-nanny",
  },
};

export const revalidate = 300;

export default async function FindANannyPage() {
  const allNannies = await getPublicNannies();
  return <FindANannyArticle allNannies={allNannies} />;
}