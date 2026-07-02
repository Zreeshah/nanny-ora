import type { Metadata } from "next";
import { getPublicNannies } from "@/lib/data/nannies";
import FindANannyClient from "./FindANannyClient";

export const metadata: Metadata = {
  title: "Find a Nanny in Auckland — NannyOra",
  description:
    "Browse agency-verified, experienced nannies across Auckland suburbs. Filter by specialist care, languages, availability, and rates.",
};

export const revalidate = 300;

export default async function FindANannyPage() {
  const allNannies = await getPublicNannies();
  return <FindANannyClient allNannies={allNannies} />;
}
