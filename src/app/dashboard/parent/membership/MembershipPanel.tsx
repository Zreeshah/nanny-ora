"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cancelMembership } from "@/server/actions/membership";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Receipt, Sparkles } from "lucide-react";

type Payment = {
  id: string;
  date: string | Date;
  description: string;
  amountCents: number;
  currency: string;
  status: string;
  provider: string;
};

type Data = {
  isMember: boolean;
  planName: string | null;
  status: string;
  renewsAt: string | Date | null;
  cancelAtPeriodEnd: boolean;
  provider: string | null;
  payments: Payment[];
};

const money = (cents: number, currency = "NZD") =>
  `${currency === "NZD" ? "NZ$" : ""}${(cents / 100).toFixed(2)}`;

const STATUS_VARIANT: Record<string, "verified" | "premium" | "listed"> = {
  ACTIVE: "verified",
  PAST_DUE: "premium",
  CANCELED: "listed",
  EXPIRED: "listed",
  INACTIVE: "listed",
};

export function MembershipPanel({ data }: { data: Data }) {
  const params = useSearchParams();
  const justPaid = params.get("checkout") === "success";

  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(data.cancelAtPeriodEnd);
  const [error, setError] = useState("");

  async function handleCancel() {
    if (!confirm("Cancel your membership? You'll keep access until your renewal date.")) return;
    setCancelling(true);
    setError("");
    const res = await cancelMembership();
    if (res.success) setCancelled(true);
    else setError(res.error || "Could not cancel.");
    setCancelling(false);
  }

  // Payment confirmed by the provider's webhook — may land a moment after redirect.
  const pendingActivation = justPaid && !data.isMember;

  return (
    <div className="space-y-6">
      {justPaid && data.isMember && (
        <Card className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">You&apos;re a member 🎉</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Messaging, shortlisting, meet-and-greets and bookings are all unlocked.
            </p>
          </div>
        </Card>
      )}

      {pendingActivation && (
        <Card className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
          <p className="text-sm font-semibold text-foreground">Confirming your payment…</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            This usually takes a few seconds. Refresh the page if your plan doesn&apos;t appear.
          </p>
        </Card>
      )}

      {/* --- Current plan --- */}
      <Card className="rounded-3xl border-border/40 p-6">
        {data.isMember ? (
          <>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1">
                  Current plan
                </p>
                <h2 className="font-heading text-2xl text-foreground">{data.planName} Membership</h2>
              </div>
              <Badge variant={STATUS_VARIANT[data.status] ?? "listed"}>
                {cancelled ? "Cancels at period end" : data.status}
              </Badge>
            </div>

            <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <dt className="text-muted-foreground text-xs mb-1">
                  {cancelled ? "Access until" : "Renews on"}
                </dt>
                <dd className="font-semibold text-foreground">
                  {data.renewsAt ? formatDate(data.renewsAt as any) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs mb-1">Paid with</dt>
                <dd className="font-semibold text-foreground capitalize">
                  {data.provider ? data.provider.toLowerCase() : "—"}
                </dd>
              </div>
            </dl>

            {cancelled ? (
              <p className="text-xs text-muted-foreground">
                Your membership won&apos;t renew. You keep full access until{" "}
                {data.renewsAt ? formatDate(data.renewsAt as any) : "your period ends"}.
              </p>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                isLoading={cancelling}
                className="rounded-full"
              >
                Cancel membership
              </Button>
            )}
            {error && (
              <p className="text-sm text-destructive mt-3" role="alert">
                {error}
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-5.5 h-5.5 stroke-[1.8]" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-xl text-foreground mb-2">You&apos;re on the free plan</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
              Browsing is free. Become a member to message nannies, shortlist favourites, request
              meet-and-greets, post jobs and make secure bookings.
            </p>
            <Link href="/membership">
              <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-primary/10">
                View membership plans
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* --- Invoices / payment history --- */}
      <Card className="rounded-3xl border-border/40 p-6">
        <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2 mb-4">
          <Receipt className="w-4.5 h-4.5 text-primary" aria-hidden="true" />
          Payment history
        </h2>

        {data.payments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40">
                  <th className="py-2 px-2 font-semibold">Date</th>
                  <th className="py-2 px-2 font-semibold">Description</th>
                  <th className="py-2 px-2 font-semibold text-right">Amount</th>
                  <th className="py-2 px-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr key={p.id} className="border-b border-border/20 last:border-0">
                    <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                      {formatDate(p.date as any)}
                    </td>
                    <td className="py-3 px-2 text-foreground">{p.description}</td>
                    <td className="py-3 px-2 text-right font-semibold text-foreground whitespace-nowrap">
                      {money(p.amountCents, p.currency)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Badge variant={p.status === "PAID" ? "verified" : "listed"}>{p.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
