import type { Metadata } from "next";
import Link from "next/link";
import { getMembershipDashboard, confirmPaypalSubscription } from "@/server/actions/membership";
import { MembershipPanel } from "./MembershipPanel";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Membership" };

export default async function ParentMembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ subscription_id?: string; checkout?: string }>;
}) {
  // PayPal redirects back with ?subscription_id=I-XXX — confirm it synchronously
  // rather than waiting on the (sometimes-delayed) webhook.
  const sp = await searchParams;
  if (sp.subscription_id) {
    await confirmPaypalSubscription(sp.subscription_id);
  }

  const res = await getMembershipDashboard();
  const data = res.data as any;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <Link
        href="/dashboard/parent"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to dashboard
      </Link>

      <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-2">Membership</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Your plan, renewal date, and payment history.
      </p>

      <MembershipPanel data={data} />
    </div>
  );
}
